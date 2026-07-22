package com.microservice.project.fitness_microservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {

    private final WebClient webClient;

    public boolean validateUser(String userId) {
        try{
            log.info("UserValidationService validateUser");
            return webClient.get()
                    .uri("/apis/users/{id}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        }catch (WebClientResponseException e){
            if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                   throw new RuntimeException("User not found");
            else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new RuntimeException("Invalid Request: " + userId);

            }
        }
        return false;
    }
}
