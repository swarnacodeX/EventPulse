package com.eventpulse.authentication.Model;

public class JWT {
    private String accesstoken;
    private String refreshtoken;

    // Add a constructor
    public JWT() {}
    
    public JWT(String accessToken, String refreshToken) {
        this.accesstoken = accessToken;
        this.refreshtoken = refreshToken;
    }

    // Your existing getters and setters...
    public String getAccesstoken() { return accesstoken; }
    public void setAccesstoken(String accesstoken) { this.accesstoken = accesstoken; }
    public String getRefreshtoken() { return refreshtoken; }
    public void setRefreshtoken(String refreshtoken) { this.refreshtoken = refreshtoken; }
}