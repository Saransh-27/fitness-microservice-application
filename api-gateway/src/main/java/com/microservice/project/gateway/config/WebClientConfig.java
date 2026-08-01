package com.microservice.project.gateway.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl("http://USER-SERVICE")
                .build();
    }

    @Bean
    public WebClient activityServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .clone()
                .baseUrl("http://ACTIVITY-SERVICE")
                .build();
    }

    @Bean
    public WebClient aiServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .clone()
                .baseUrl("http://AI-SERVICE")
                .build();
    }
}
