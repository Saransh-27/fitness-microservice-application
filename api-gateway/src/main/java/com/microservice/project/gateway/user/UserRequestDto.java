package com.microservice.project.gateway.user;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String keycloakId;
    private String username;
    private String password;
    private String email;
    private String frontname;
    private String lastname;

}
