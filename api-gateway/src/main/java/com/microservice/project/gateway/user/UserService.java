package com.microservice.project.gateway.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class UserService {
    private final WebClient userServiceWebClient;
    private final WebClient activityServiceWebClient;
    private final WebClient aiServiceWebClient;

    public UserService(
            @Qualifier("userServiceWebClient") WebClient userServiceWebClient,
            @Qualifier("activityServiceWebClient") WebClient activityServiceWebClient,
            @Qualifier("aiServiceWebClient") WebClient aiServiceWebClient) {
        this.userServiceWebClient = userServiceWebClient;
        this.activityServiceWebClient = activityServiceWebClient;
        this.aiServiceWebClient = aiServiceWebClient;
    }

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling User Validation API for userId/keycloakId: {}", userId);
        return userServiceWebClient.get()
                .uri("/apis/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(e -> {
                    log.warn("Error validating user {}: {}. Assuming user does not exist.", userId, e.getMessage());
                    return Mono.just(false);
                });
    }

    public Mono<UserResponseDto> registerUser(UserRequestDto request) {
        log.info("Calling User Registration API for email: {}, keycloakId: {}", request.getEmail(), request.getKeycloakId());
        return userServiceWebClient.post()
                .uri("/apis/users/register")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UserResponseDto.class)
                .onErrorResume(e -> {
                    log.error("Error registering user with email {}: {}", request.getEmail(), e.getMessage());
                    return Mono.empty();
                });
    }

    public Mono<Void> deleteUser(String id) {
        log.info("Calling User Service to delete user: {}", id);
        return userServiceWebClient.delete()
                .uri("/apis/users/{id}", id)
                .retrieve()
                .toBodilessEntity()
                .then()
                .onErrorResume(e -> {
                    log.error("Error deleting user {} in user-microservice: {}", id, e.getMessage());
                    return Mono.empty();
                });
    }

    public Mono<Void> deleteAllActivity(String userid) {
        log.info("Calling Activity Service to delete user's all activities: {}", userid);
        return activityServiceWebClient.delete()
                .uri("/apis/activities/all/{userid}", userid)
                .retrieve()
                .toBodilessEntity()
                .then()
                .onErrorResume(e -> {
                    log.error("Error deleting all activities of user {} in activity-service: {}", userid, e.getMessage());
                    return Mono.empty();
                });
    }

    public Mono<Void> deleteAllAIRecommendation(String userid) {
        log.info("Calling AI Service to delete user's AI recommendations: {}", userid);
        return aiServiceWebClient.delete()
                .uri("/apis/recommendation/activity/{userId}", userid)
                .retrieve()
                .toBodilessEntity()
                .then()
                .onErrorResume(e -> {
                    log.error("Error deleting all AI recommendations of user {} in ai-service: {}", userid, e.getMessage());
                    return Mono.empty();
                });
    }
}
