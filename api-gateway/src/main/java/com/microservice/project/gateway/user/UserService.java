package com.microservice.project.gateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final WebClient userServiceWebClient;

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
}
