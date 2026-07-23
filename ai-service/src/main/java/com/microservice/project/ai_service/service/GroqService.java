package com.microservice.project.ai_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@Slf4j
public class GroqService {

    @Value("${GROQ_API_URL}")
    private String apiUrl;
    @Value("${GROQ_API_KEY}")
    private String apiKey;
    @Value("${GROQ_API_MODEL}")
    private String model;
    private final WebClient webClient;
    public GroqService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }
    public String getAnswer(String question){
        try {
            log.info("Making the API call to GROQ.........");
            Map<String, Object> requestBody = Map.of(
                    "messages", new Object[]{
                            Map.of("role", "user", "content", question)
                    },
                    "model", model,
                    "temperature", 1,
                    "max_completion_tokens", 2048,
                    "top_p", 1,
                    "stream", false,
                    "reasoning_effort","medium",
                    "stop", "null"
            );

            String response = String.valueOf(webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block());
            log.info("GROQ API call SUCCEEDED.....");
//            log.info("GROQ API response: {}", response);
            return response;
        } catch (Exception e) {
            log.error("GROQ API call FAILED: {}", e.getMessage());
            throw new RuntimeException("Groq service failed", e);
        }
    }
}
