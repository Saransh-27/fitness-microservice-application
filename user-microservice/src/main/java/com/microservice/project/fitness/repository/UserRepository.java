package com.microservice.project.fitness.repository;

import com.microservice.project.fitness.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Boolean existsByEmail(String email);

    Boolean existsByKeycloakId(String keycloakId);

    User findByEmail(String email);

    User findByKeycloakId(String keycloakId);

    Optional<User> findByUsername(String username);
}
