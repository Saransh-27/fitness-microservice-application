package com.microservice.project.ai_service.service;

import com.microservice.project.ai_service.entity.Activity;
import com.microservice.project.ai_service.entity.Recommendation;
import com.microservice.project.ai_service.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository  recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        try {
            log.info("Received activity message: {}", activity.getId());
            Recommendation recommendation = aiService.generateRecommendation(activity);
            log.info("AI RESPONSE GENERATED SUCCESSFULLY ");
            recommendationRepository.save(recommendation);
            log.info("AI RESPONSE SAVED IN DB SUCCESSFULLY");
        } catch (Exception e) {
            log.error("Failed to process activity {}: {}", activity.getId(), e.getMessage());
            // Don't re-throw - this prevents infinite redelivery
        }
    }
}
