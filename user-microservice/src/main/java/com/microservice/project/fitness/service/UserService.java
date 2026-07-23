package com.microservice.project.fitness.service;

import com.microservice.project.fitness.dto.UserRequestDto;
import com.microservice.project.fitness.dto.UserResponseDto;
import com.microservice.project.fitness.dto.UserUpdateDto;
import com.microservice.project.fitness.entity.User;
import com.microservice.project.fitness.mapper.UserMapper;
import com.microservice.project.fitness.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDto register(UserRequestDto dto){
        if (dto.getKeycloakId() != null && userRepository.existsByKeycloakId(dto.getKeycloakId())) {
            User existingUser = userRepository.findByKeycloakId(dto.getKeycloakId());
            return UserMapper.toResponse(existingUser);
        }
        if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail())) {
            User existingUser = userRepository.findByEmail(dto.getEmail());
            if (dto.getKeycloakId() != null && existingUser.getKeycloakId() == null) {
                existingUser.setKeycloakId(dto.getKeycloakId());
                userRepository.save(existingUser);
            }
            return UserMapper.toResponse(existingUser);
        }

        User user = UserMapper.toEntity(dto);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            user.setPassword(passwordEncoder.encode("dummy@123123"));
        }
        User savedUser = userRepository.save(user);
        return UserMapper.toResponse(savedUser);
    }

    public UserResponseDto updateUser(String id, UserUpdateDto dto) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (dto.getUsername() != null) {
                user.setUsername(dto.getUsername());
            }
            if (dto.getEmail() != null) {
                user.setEmail(dto.getEmail());
            }
            if (dto.getFrontname() != null) {
                user.setFrontname(dto.getFrontname());
            }
            if (dto.getLastname() != null) {
                user.setLastname(dto.getLastname());
            }
            userRepository.save(user);
            return UserMapper.toResponse(user);
        }
        return null;
    }

    public Boolean existByUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return false;
        }
        log.info("Checking user existence for userId/keycloakId: {}", userId);
        return userRepository.existsByKeycloakId(userId) || userRepository.existsById(userId);
    }
}

