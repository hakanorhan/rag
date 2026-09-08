package com.example.commonlib.security;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.ExpressionJwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;

import org.springframework.expression.spel.standard.SpelExpressionParser;

public final class CommonSecurity {

    private CommonSecurity() {
    }

    public static SecurityFilterChain configure(
            HttpSecurity http,
            HandlerExceptionResolver exceptionResolver,
            Customizer<AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry>
                    endpointRules
    ) throws Exception {
        AuthenticationEntryPoint authenticationEntryPoint = (request, response, exception) -> {
            new BearerTokenAuthenticationEntryPoint().commence(request, response, exception);
            exceptionResolver.resolveException(request, response, null, exception);
        };
        AccessDeniedHandler accessDeniedHandler = (request, response, exception) -> {
            new BearerTokenAccessDeniedHandler().handle(request, response, exception);
            exceptionResolver.resolveException(request, response, null, exception);
        };

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers("/actuator/health", "/actuator/health/**").permitAll();
                    endpointRules.customize(authorize);
                    authorize.anyRequest().authenticated();
                })
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .build();
    }

    private static JwtAuthenticationConverter jwtAuthenticationConverter() {
        var realmRolesConverter = new ExpressionJwtGrantedAuthoritiesConverter(
                new SpelExpressionParser().parseExpression(
                        "[realm_access][roles].![#this.toUpperCase()]"
                )
        );
        realmRolesConverter.setAuthorityPrefix("ROLE_");

        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(realmRolesConverter);
        return jwtAuthenticationConverter;
    }
}
