package com.microservice.project.fitness_microservice.repository;

import com.microservice.project.fitness_microservice.entity.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

}
