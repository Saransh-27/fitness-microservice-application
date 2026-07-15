package com.microservice.project.fitness.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class UserUpdateDto {
    private String username;
    private String password;
    private String email;
    private String frontname;
    private String lastname;
}
