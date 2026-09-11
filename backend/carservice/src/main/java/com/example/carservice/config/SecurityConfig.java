package com.example.carservice.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.example.commonlib.security.CommonSecurity;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver
    ) throws Exception {
        return CommonSecurity.configure(http, exceptionResolver, authorize -> authorize
                        .requestMatchers(
                                HttpMethod.GET,
                                "/cars",
                                "/cars/search",
                                "/cars/search/free-text",
                                "/locations",
                                "/reservation/options"
                        )
                        .permitAll()
        );
    }
}
