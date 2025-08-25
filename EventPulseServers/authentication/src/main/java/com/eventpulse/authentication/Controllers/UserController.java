package com.eventpulse.authentication.Controllers;
import com.eventpulse.authentication.Model.UserModel;
import com.eventpulse.authentication.Services.UserServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class UserController {
    @Autowired
     private UserServices services;

     @PostMapping("/login")
     public String postMethodName(@RequestBody UserModel user) {
         
         
         return "done";
     }
     
    
}
