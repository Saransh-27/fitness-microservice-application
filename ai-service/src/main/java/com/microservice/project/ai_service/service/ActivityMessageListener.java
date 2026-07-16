package com.microservice.project.ai_service.service;

import com.microservice.project.ai_service.entity.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        try {
            log.info("Received activity message: {}", activity.getId());
            String recommendation = aiService.generateRecommendation(activity);
            log.info("Generated Recommendation: {}", recommendation);
        } catch (Exception e) {
            log.error("Failed to process activity {}: {}", activity.getId(), e.getMessage());
            // Don't re-throw - this prevents infinite redelivery
        }
    }
}
