package com.microservice.project.ai_service.controller;

import com.microservice.project.ai_service.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/activity/{userId}")
    public ResponseEntity<?> deleteAllActivityRecommendation(@PathVariable String userId){
        return ResponseEntity.ok(recommendationservice.deleteAllActivityRecommendation(userId));
    }
}
