package com.microservice.project.ai_service.service;

import com.microservice.project.ai_service.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationrepository;

    public Object getUserRecommendation(String userId) {
        return recommendationrepository.findByUserId(userId);

    }

    public Object getActivityRecommendation(String activityId) {
        return recommendationrepository. findByActivityId(activityId)
                .orElseThrow(()->new RuntimeException("Recommendation not found for activityId: " + activityId));
    }

}
