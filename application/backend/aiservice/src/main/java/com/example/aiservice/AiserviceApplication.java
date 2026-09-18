package com.example.aiservice;

import com.example.aiservice.car.CarServiceClient;
import com.example.commonlib.errorhandling.AuthExceptionHandler;
import com.example.commonlib.errorhandling.ValidationExceptionHandler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Import;
import org.springframework.web.service.registry.ImportHttpServices;

@SpringBootApplication
@ConfigurationPropertiesScan
@Import({AuthExceptionHandler.class, ValidationExceptionHandler.class})
@ImportHttpServices(group = "carservice", types = CarServiceClient.class)
public class AiserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiserviceApplication.class, args);
	}

}
