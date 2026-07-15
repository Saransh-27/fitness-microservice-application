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
        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
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
            return UserResponseDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .frontname(user.getFrontname())
                    .lastname(user.getLastname())
                    .build();
        }
        return null;
    }

    public Boolean existByUserId(String userId) {
        log.info("UserService existByUserId");
        return userRepository.existsById(userId);
    }
}

