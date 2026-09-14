package com.example.carservice.car;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserProfileDTO getProfile(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId)
                .map(user -> new UserProfileDTO(user.getDriverLicenseNumber()))
                .orElseGet(() -> new UserProfileDTO(null));
    }

    @Transactional
    public UserProfileDTO saveProfile(Jwt jwt, UpdateUserProfileRequest request) {
        var user = userRepository.findByKeycloakId(jwt.getSubject()).orElseGet(User::new);
        var email = jwt.getClaimAsString("email");
        if (email == null || email.isBlank()) {
            throw new UserProfileException(UserProfileError.KEYCLOAK_EMAIL_REQUIRED);
        }

        user.setKeycloakId(jwt.getSubject());
        user.setEmail(email);
        user.setDriverLicenseNumber(request.driverLicenseNumber().trim());

        try {
            var savedUser = userRepository.saveAndFlush(user);
            return new UserProfileDTO(savedUser.getDriverLicenseNumber());
        } catch (DataIntegrityViolationException exception) {
            throw new UserProfileException(UserProfileError.USER_PROFILE_CONFLICT, exception);
        }
    }
}
