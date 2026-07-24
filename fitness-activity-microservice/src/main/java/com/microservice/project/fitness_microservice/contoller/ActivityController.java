package com.microservice.project.fitness_microservice.contoller;

import com.microservice.project.fitness_microservice.dto.ActivityRequestDto;
import com.microservice.project.fitness_microservice.dto.ActivityResponseDto;
import com.microservice.project.fitness_microservice.repository.ActivityRepository;
import com.microservice.project.fitness_microservice.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<?> getAllActivities(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable String id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivityById(@PathVariable String id) {

        return ResponseEntity.ok(activityService.deleteById(id));

    }
}

