package com.microservice.project.fitness_microservice.contoller;

import com.microservice.project.fitness_microservice.dto.ActivityRequestDto;
import com.microservice.project.fitness_microservice.dto.ActivityResponseDto;
import com.microservice.project.fitness_microservice.repository.ActivityRepository;
import com.microservice.project.fitness_microservice.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/apis/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;
    @Autowired
    private ActivityRepository activityRepository;

    @PostMapping
    public ResponseEntity<?> addActivities(@RequestBody ActivityRequestDto dto) {
        ActivityResponseDto savedActivity = activityService.createActivity(dto);
        return ResponseEntity.ok(savedActivity);
    }

    @GetMapping
    public ResponseEntity<?> getAllActivities() {
        return ResponseEntity.ok(activityRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable String id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }
}

