package com.eventpulse.authentication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.ApplicationContext;// access the container

@SpringBootApplication
public class AuthenticationApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthenticationApplication.class, args);//creates a container in jvm containing all the objects specified as @Component
		//Dev obj=context.getBean(Dev.class);//get object of a class from the container
		//obj.build();
	}

}
