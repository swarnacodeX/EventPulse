package com.eventpulse.authentication.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eventpulse.authentication.Model.UserModel;

public interface UserRepository extends MongoRepository <UserModel,String> {
    
}
