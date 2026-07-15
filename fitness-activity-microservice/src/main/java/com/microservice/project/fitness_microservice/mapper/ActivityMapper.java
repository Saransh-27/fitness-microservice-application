package com.microservice.project.fitness_microservice.mapper;


import com.microservice.project.fitness_microservice.dto.ActivityRequestDto;
import com.microservice.project.fitness_microservice.dto.ActivityResponseDto;
import com.microservice.project.fitness_microservice.entity.Activity;

public class ActivityMapper {

    private ActivityMapper() {}

    // Request → Entity
    public static Activity toEntity(ActivityRequestDto dto) {
        Activity activity = new Activity();
        activity.setUserid(dto.getUserid());
        activity.setType(dto.getType());
        activity.setDuration(dto.getDuration());
        activity.setCaloriesBurned(dto.getCaloriesBurned());
        activity.setStartTime(dto.getStartTime());
        activity.setAdditionalMatrics(dto.getAdditionalMatrics());
        return activity;
    }

    // Entity → Response
    public static ActivityResponseDto toResponse(Activity activity) {
        return ActivityResponseDto.builder()
                .id(activity.getId())
                .userid(activity.getUserid())
                .type(activity.getType())
                .duration(activity.getDuration())
                .caloriesBurned(activity.getCaloriesBurned())
                .startTime(activity.getStartTime())
                .additionalMatrics(activity.getAdditionalMatrics())
                .createdAt(activity.getCreatedAt())
                .build();
    }

}
