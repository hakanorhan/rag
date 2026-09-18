package com.example.carservice.car;

import lombok.Getter;

@Getter
public class UserProfileException extends RuntimeException {

    private final UserProfileError error;

    public UserProfileException(UserProfileError error) {
        super(error.name());
        this.error = error;
    }

    public UserProfileException(UserProfileError error, Throwable cause) {
        super(error.name(), cause);
        this.error = error;
    }
}
