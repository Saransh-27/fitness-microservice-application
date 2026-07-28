package com.microservice.project.fitness_microservice.repository;

import com.microservice.project.fitness_microservice.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    Page<Activity> findByUserid(String userid, Pageable pageable);
    List<Activity> findByUserid(String userid);
}
