package com.eventpulse.authentication.Repository;

import com.eventpulse.authentication.Model.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends MongoRepository<UserModel, String> {
    boolean existsByEmail(String email);
    Optional<UserModel> findByUserID(UUID userID);
    Optional<UserModel> findByEmail(String email);
}
