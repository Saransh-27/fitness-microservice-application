package com.microservice.project.fitness_microservice.service;

import com.microservice.project.fitness_microservice.dto.ActivityRequestDto;
import com.microservice.project.fitness_microservice.dto.ActivityResponseDto;
import com.microservice.project.fitness_microservice.entity.Activity;
import com.microservice.project.fitness_microservice.mapper.ActivityMapper;
import com.microservice.project.fitness_microservice.repository.ActivityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserValidationService  userValidationService;
    @Autowired
    private RabbitTemplate  rabbitTemplate;
    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponseDto createActivity(ActivityRequestDto dto) {
        boolean isValidate = userValidationService.validateUser(dto.getUserid());
        if (!isValidate){
            throw new RuntimeException("Invalid User" + dto.getUserid());
        }
        Activity activity = ActivityMapper.toEntity(dto);
        Activity savedActivity = activityRepository.save(activity);
        try{
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        }catch (Exception e){
            log.error("Error sending message to RabbitMQ: {}", e.getMessage());
        }
        return ActivityMapper.toResponse(savedActivity);
    }

    public ActivityResponseDto getActivityById(String id) {
        return activityRepository.findById(id)
                .map(ActivityMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
    }

    public String deleteById(String id) {
        try{
            Activity activity = activityRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
            activityRepository.delete(activity);
            return "Activity deleted successfully with id: " + id;
        }catch (Exception e){
            return new RuntimeException("Error deleting activity with id: " + id + ". Error: " + e.getMessage()).getMessage();
        }
    }

    public String deleteAllByUserId(String userid) {
        try{
            List<Activity> activities = activityRepository.findByUserid(userid);
            if (activities == null || activities.isEmpty()) {
                return "No activities found for user with id: " + userid;
            }
            activityRepository.deleteAll(activities);
            return "All activities deleted successfully for user with id: " + userid;
        }catch (Exception e){
            return new RuntimeException("Error deleting activities for user with id: " + userid + ". Error: " + e.getMessage()).getMessage();
        }
    }
}
