package com.eventpulse.authentication.Services;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.eventpulse.authentication.Model.UserModel;
import com.eventpulse.authentication.Repository.UserRepository;

@Component//specifying java to create object
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    public UUID Login(UserModel user){
        return user.getUserID();
    }
}
