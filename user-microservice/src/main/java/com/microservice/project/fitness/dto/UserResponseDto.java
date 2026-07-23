package com.microservice.project.fitness.dto;

import com.microservice.project.fitness.payload.UserRole;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Data
@Builder
public class UserResponseDto {
    private String id;
    private String keycloakId;
    private String username;
    private String password;
    @Builder.Default
    private UserRole role = UserRole.USER;
    private String email;
    private String frontname;
    private String lastname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
