package com.microservice.project.ai_service.controller;

import com.microservice.project.ai_service.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/apis/recommendation")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationservice;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRecommendation(@PathVariable String userId){
        return ResponseEntity.ok(recommendationservice.getUserRecommendation(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<?> getActivityRecommendation(@PathVariable String activityId){
        return ResponseEntity.ok(recommendationservice.getActivityRecommendation(activityId));
    }
}
