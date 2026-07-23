package com.microservice.project.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private String id;
    private String keycloakId;
    private String username;
    private String email;
    private String frontname;
    private String lastname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
