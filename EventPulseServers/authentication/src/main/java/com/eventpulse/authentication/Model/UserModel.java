package com.eventpulse.authentication.Model;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

@Component
@Document(collection="users")
public class UserModel {
    private String username;
    @Id
    private UUID userID;
    private String email;
    private String password;
    private String accesstoken;

    public UUID getUserID(UUID userID){
        return userID;
    }
    public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        this.username=username;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public String getPassword(){
        return password;
    }
    public void setpassword(String password){
        this.password=password;
    }
    public String getaccesstoken(){
        return accesstoken;
    }
    public void setaccesstoken(String accesstoken){
        this.accesstoken=accesstoken;
    }

}
