package com.microservice.project.ai_service.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.message.StringFormattedMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${Gemini.api.url}")
    private String apiUrl;
    @Value("${Gemini.api.key}")
    private String apiKey;
    private final WebClient webClient;

    public GeminiService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String getAnswer(String question){
        log.info("Making the API call to AI.........");
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
                }
        );

        String response = String.valueOf(webClient.post()
                .uri(apiUrl)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block());
        log.info("API call SUCCEEDED.....");
        return response;
    }
}
