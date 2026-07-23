package com.microservice.project.fitness.dto;

import com.microservice.project.fitness.payload.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String keycloakId;
    private String username;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;
    @Column(unique = true,  nullable = false)
    private String email;
    private String frontname;
    private String lastname;
}
