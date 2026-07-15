package com.microservice.project.fitness.mapper;


import com.microservice.project.fitness.dto.UserRequestDto;
import com.microservice.project.fitness.dto.UserResponseDto;
import com.microservice.project.fitness.entity.User;

public class UserMapper {

    private UserMapper() {}

    // Request → Entity
    public static User toEntity(UserRequestDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFrontname(dto.getFrontname());
        user.setLastname(dto.getLastname());
        return user; // password handled in service
    }

    // Entity → Response
    public static UserResponseDto toResponse(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .frontname(user.getFrontname())
                .lastname(user.getLastname())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

}
