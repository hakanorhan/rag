package com.example.aiservice;

import com.example.aiservice.car.CarServiceClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.service.registry.ImportHttpServices;

@SpringBootApplication
@ImportHttpServices(group = "carservice", types = CarServiceClient.class)
public class AiserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiserviceApplication.class, args);
	}

}
