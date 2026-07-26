package com.microservice.project.gateway.config;

import com.microservice.project.gateway.user.UserRequestDto;
import com.microservice.project.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;
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

        return userService.validateUser(userId)
                .flatMap(exist -> {
                    if (Boolean.FALSE.equals(exist)) {
                        log.info("User {} not found in database. Triggering automatic registration sync...", userId);
                        return userService.registerUser(registerRequest).then(Mono.empty());
                    } else {
                        log.info("User {} already exists in database. Skipping registration sync.", userId);
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
