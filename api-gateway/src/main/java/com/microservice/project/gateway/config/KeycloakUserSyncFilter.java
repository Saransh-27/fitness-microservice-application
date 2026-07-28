package com.microservice.project.gateway.config;

import com.microservice.project.gateway.user.UserRequestDto;
import com.microservice.project.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    /**
     * In-memory cache of validated user IDs.
     * Key: keycloakId/userId, Value: timestamp (ms) when validated.
     * Entries expire after CACHE_TTL_MS to allow eventual re-checks.
     */
    private final Map<String, Long> validatedUsersCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (org.springframework.http.HttpMethod.OPTIONS.equals(exchange.getRequest().getMethod())) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userIdHeader = exchange.getRequest().getHeaders().getFirst("X-User-ID");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        UserRequestDto registerRequest = extractUserDetailsFromToken(authHeader);
        if (registerRequest == null || registerRequest.getKeycloakId() == null) {
            return chain.filter(exchange);
        }

        String userId = (userIdHeader != null && !userIdHeader.isBlank())
                ? userIdHeader
                : registerRequest.getKeycloakId();

        // Check in-memory cache first to avoid redundant HTTP calls
        Long cachedAt = validatedUsersCache.get(userId);
        if (cachedAt != null && (System.currentTimeMillis() - cachedAt) < CACHE_TTL_MS) {
            // User was recently validated — skip the remote call
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-ID", userId)
                    .build();
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }

        return userService.validateUser(userId)
                .flatMap(exist -> {
                    if (Boolean.FALSE.equals(exist)) {
                        log.info("User {} not found in database. Triggering automatic registration sync...", userId);
                        return userService.registerUser(registerRequest)
                                .doOnSuccess(u -> validatedUsersCache.put(userId, System.currentTimeMillis()))
                                .then(Mono.empty());
                    } else {
                        log.info("User {} validated and cached.", userId);
                        validatedUsersCache.put(userId, System.currentTimeMillis());
                        return Mono.empty();
                    }
                })
                .then(Mono.defer(() -> {
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header("X-User-ID", userId)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }));
    }

    private UserRequestDto extractUserDetailsFromToken(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            String keycloakId = claims.getStringClaim("sub");
            String email = claims.getStringClaim("email");
            String firstName = claims.getStringClaim("given_name");
            String lastName = claims.getStringClaim("family_name");
            String username = claims.getStringClaim("preferred_username");

            if (username == null || username.isBlank()) {
                username = email != null ? email : keycloakId;
            }

            return new UserRequestDto(
                    keycloakId,
                    username,
                    "dummy@123123",
                    email,
                    firstName != null ? firstName : "",
                    lastName != null ? lastName : ""
            );
        } catch (Exception e) {
            log.error("Failed to parse JWT token claims for user sync: {}", e.getMessage());
            return null;
        }
    }
}
