package com.eventpulse.authentication;

import org.springframework.stereotype.Component;

@Component// this annotation specifies java to automatically build an object in the container
public class Dev {
    public void build(){
        System.out.println("Building Dev");
    }
}
