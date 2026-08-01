package com.microservice.project.ai_service.service;

import com.microservice.project.ai_service.entity.Recommendation;
import com.microservice.project.ai_service.repository.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
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

    public String deleteAllActivityRecommendation(String userId) {
        try{
            List<Recommendation> recommendations = recommendationrepository.findByUserId(userId);
            if (recommendations == null || recommendations.isEmpty()) {
                return "No recommendations found for userId: " + userId;
            }
            recommendationrepository.deleteAll(recommendations);
            return "All recommendations deleted successfully for userId: " + userId;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting all recommendations for userId: " + userId, e);
        }
    }
}
