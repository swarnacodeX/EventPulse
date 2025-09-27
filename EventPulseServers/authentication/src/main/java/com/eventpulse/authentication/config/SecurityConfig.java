package com.eventpulse.authentication.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        return http
            // Disable CSRF for stateless REST APIs
            .csrf(csrf -> csrf.disable())

            // Apply default CORS configuration
            .cors(Customizer.withDefaults())

            // Authorize all requests without authentication
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // Disable HTTP Basic and form login
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable())

            // Build the security filter chain
            .build();
    }
}
