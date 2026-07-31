package com.microservice.project.fitness.controller;

import com.microservice.project.fitness.dto.UserRequestDto;
import com.microservice.project.fitness.dto.UserResponseDto;
import com.microservice.project.fitness.dto.UserUpdateDto;
import com.microservice.project.fitness.entity.User;
import com.microservice.project.fitness.repository.UserRepository;
import com.microservice.project.fitness.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/apis/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto dto){
        log.info("Registration request received for email: {}, keycloakId: {}", dto.getEmail(), dto.getKeycloakId());
        UserResponseDto userSaved = userService.register(dto);
        return ResponseEntity.ok(userSaved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        // Try finding by PostgreSQL UUID first
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        // Fallback: try finding by keycloakId (frontend passes Keycloak sub claim)
        User userByKeycloak = userRepository.findByKeycloakId(id);
        if (userByKeycloak != null) {
            return ResponseEntity.ok(userByKeycloak);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<?> getAll(){
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserUpdateDto dto) {
        UserResponseDto updatedUser = userService.updateUser(id, dto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            log.info("Delete request for user id/keycloakId: {}", id);
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                userRepository.delete(userOpt.get());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("User deleted successfully");
            }
            User userByKeycloak = userRepository.findByKeycloakId(id);
            if (userByKeycloak != null) {
                userRepository.delete(userByKeycloak);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("User deleted successfully");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            log.error("Error deleting user with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
        }
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existByUserId(userId));
    }
}
