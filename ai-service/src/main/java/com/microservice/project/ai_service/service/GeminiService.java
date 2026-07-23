package com.microservice.project.ai_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final GroqService groqService;

    public GeminiService(WebClient.Builder webClient, GroqService groqService) {
        this.webClient = webClient.build();
        this.groqService = groqService;
    }

    public String getAnswer(String question){
        try {
            log.info("Making the API call to GEMINI.........");
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
            log.info("GEMINI API call SUCCEEDED.....");
            return response;
        } catch (Exception e){
            log.error("GEMINI API call FAILED: {}", e.getMessage());
            log.info("Switching to GROQ API as fallback.....");
            try {
                return groqService.getAnswer(question);
            } catch (Exception groqException) {
                log.error("GROQ API call also FAILED: {}", groqException.getMessage());
                throw new RuntimeException("Both GEMINI and GROQ services failed", groqException);
            }
        }
    }
}
