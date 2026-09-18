package com.example.carservice;

import org.springframework.boot.SpringApplication;

public class TestCarserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(CarserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
