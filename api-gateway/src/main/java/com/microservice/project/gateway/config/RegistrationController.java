package com.microservice.project.gateway.config;

import com.microservice.project.gateway.user.UserRequestDto;
import com.microservice.project.gateway.user.UserResponseDto;
import com.microservice.project.gateway.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Handles full user registration:
 *   1. Creates the user in Keycloak via Admin REST API (server-side, no CORS)
 *   2. Registers the user in the PostgreSQL database via User Microservice
 */
@RestController
@RequestMapping("/gateway/register")
@Slf4j
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;

    @Value("${keycloak.admin.url:http://localhost:8181}")
    private String keycloakUrl;

    @Value("${keycloak.admin.realm:fitness-oauth2}")
    private String keycloakRealm;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin}")
    private String adminPassword;

    private final WebClient keycloakWebClient = WebClient.builder().build();

    @PostMapping
    public Mono<UserResponseDto> registerUser(@RequestBody UserRequestDto request) {
        log.info("Full registration request received for username: {}", request.getUsername());

        // Step 1: Get Keycloak admin token from master realm
        return getAdminToken()
                .flatMap(adminToken ->
                        // Step 2: Create user in Keycloak realm
                        createKeycloakUser(adminToken, request)
                                .then(
                                        // Step 3: Get the newly created user's Keycloak ID (sub)
                                        getKeycloakUserId(adminToken, request.getUsername())
                                )
                )
                .flatMap(keycloakId -> {
                    // Step 4: Register user in PostgreSQL via User Microservice
                    UserRequestDto dbRequest = new UserRequestDto(
                            keycloakId,
                            request.getUsername(),
                            request.getPassword(),
                            request.getEmail(),
                            request.getFrontname() != null ? request.getFrontname() : "",
                            request.getLastname() != null ? request.getLastname() : ""
                    );
                    return userService.registerUser(dbRequest);
                })
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Registration failed."
                )));
    }

    private Mono<String> getAdminToken() {
        String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";
        return keycloakWebClient.post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("client_id", "admin-cli")
                        .with("grant_type", "password")
                        .with("username", adminUsername)
                        .with("password", adminPassword))
                .retrieve()
                .bodyToMono(Map.class)
                .map(body -> (String) body.get("access_token"))
                .doOnError(e -> log.error("Failed to get Keycloak admin token: {}", e.getMessage()))
                .onErrorMap(e -> new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Could not authenticate with Keycloak admin. Ensure Keycloak is running."
                ));
    }

    @SuppressWarnings("unchecked")
    private Mono<Void> createKeycloakUser(String adminToken, UserRequestDto request) {
        String createUrl = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users";

        Map<String, Object> userPayload = Map.of(
                "username", request.getUsername(),
                "email", request.getEmail() != null ? request.getEmail() : "",
                "firstName", request.getFrontname() != null ? request.getFrontname() : request.getUsername(),
                "lastName", request.getLastname() != null ? request.getLastname() : "",
                "enabled", true,
                "emailVerified", true,
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", request.getPassword() != null ? request.getPassword() : "changeme",
                        "temporary", false
                ))
        );

        return keycloakWebClient.post()
                .uri(createUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .bodyValue(userPayload)
                .retrieve()
                .toBodilessEntity()
                .doOnSuccess(r -> log.info("Keycloak user '{}' created successfully (status: {})",
                        request.getUsername(), r.getStatusCode()))
                .then()
                .onErrorResume(e -> {
                    String msg = e.getMessage() != null ? e.getMessage() : "";
                    // 409 Conflict = user already exists in Keycloak — not an error
                    if (msg.contains("409")) {
                        log.warn("User '{}' already exists in Keycloak. Proceeding.", request.getUsername());
                        return Mono.empty();
                    }
                    log.error("Failed to create user '{}' in Keycloak: {}", request.getUsername(), msg);
                    return Mono.error(new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Failed to create user in Keycloak: " + msg
                    ));
                });
    }

    private final KeycloakUserSyncFilter userSyncFilter;

    @DeleteMapping("/users/{id}")
    public Mono<ResponseEntity<String>> deleteUserPermanently(@PathVariable String id) {
        log.info("Permanent deletion request for user/keycloakId: {}", id);

        return getAdminToken()
                .flatMap(adminToken -> deleteKeycloakUser(adminToken, id))
                .then(userService.deleteAllAIRecommendation(id))
                .then(userService.deleteAllActivity(id))
                .then(userService.deleteUser(id))
                .doOnSuccess(v -> {
                    userSyncFilter.evictUser(id);
                    log.info("User {} successfully deleted from both Keycloak and PostgreSQL database.", id);
                })
                .thenReturn(ResponseEntity.ok("User permanently deleted from Keycloak and database."));
    }

    private Mono<Void> deleteKeycloakUser(String adminToken, String targetId) {
        String deleteUrl = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users/" + targetId;

        return keycloakWebClient.delete()
                .uri(deleteUrl)
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .toBodilessEntity()
                .doOnSuccess(r -> log.info("Successfully deleted Keycloak user directly by ID '{}' (status: {})", targetId, r.getStatusCode()))
                .then()
                .onErrorResume(e -> {
                    log.warn("Direct Keycloak deletion by ID '{}' failed ({}), searching Keycloak users list...", targetId, e.getMessage());
                    return findAndDeleteKeycloakUser(adminToken, targetId);
                });
    }

    @SuppressWarnings("unchecked")
    private Mono<Void> findAndDeleteKeycloakUser(String adminToken, String searchTerm) {
        String searchUrl = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users?search=" + searchTerm;

        return keycloakWebClient.get()
                .uri(searchUrl)
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .flatMap(users -> {
                    if (users == null || users.isEmpty()) {
                        log.warn("No Keycloak user found matching search term '{}'", searchTerm);
                        return Mono.empty();
                    }
                    Map<String, Object> userMap = (Map<String, Object>) users.get(0);
                    String kcSubId = (String) userMap.get("id");
                    log.info("Found Keycloak user '{}' with sub ID '{}'. Deleting from Keycloak now...", searchTerm, kcSubId);
                    String deleteUrl = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users/" + kcSubId;

                    return keycloakWebClient.delete()
                            .uri(deleteUrl)
                            .header("Authorization", "Bearer " + adminToken)
                            .retrieve()
                            .toBodilessEntity()
                            .doOnSuccess(r -> log.info("Keycloak user '{}' (ID: {}) successfully deleted", searchTerm, kcSubId))
                            .then();
                })
                .onErrorResume(e -> {
                    log.error("Failed during findAndDeleteKeycloakUser for '{}': {}", searchTerm, e.getMessage());
                    return Mono.empty();
                });
    }

    private Mono<String> getKeycloakUserId(String adminToken, String username) {
        String searchUrl = keycloakUrl + "/admin/realms/" + keycloakRealm + "/users?username=" + username + "&exact=true";

        return keycloakWebClient.get()
                .uri(searchUrl)
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .flatMap(users -> {
                    if (users == null || users.isEmpty()) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User created in Keycloak but could not retrieve user ID."
                        ));
                    }
                    @SuppressWarnings("unchecked")
                    Map<String, Object> user = (Map<String, Object>) users.get(0);
                    String id = (String) user.get("id");
                    log.info("Keycloak user '{}' has ID: {}", username, id);
                    return Mono.just(id);
                })
                .doOnError(e -> log.error("Failed to fetch Keycloak user ID for '{}': {}", username, e.getMessage()));
    }
}
