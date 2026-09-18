package com.example.carservice;

import com.example.commonlib.errorhandling.AuthExceptionHandler;
import com.example.commonlib.errorhandling.ValidationExceptionHandler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import({AuthExceptionHandler.class, ValidationExceptionHandler.class})
public class CarserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarserviceApplication.class, args);
	}

}
