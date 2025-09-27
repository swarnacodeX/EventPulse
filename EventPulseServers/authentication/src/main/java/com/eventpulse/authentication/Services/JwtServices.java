package com.eventpulse.authentication.Services;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.eventpulse.authentication.Model.JWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JwtServices {
    
    
    @Value("${jwt.secret}")
    private String secretKey;

    private final ObjectMapper objMp = new ObjectMapper();

    public JWT createToken(String userId) {
        try {
            // 1️⃣ Header
            Map<String, Object> header = Map.of(
                "alg", "HS512",
                "typ", "JWT"
            );
            
            // 2️⃣ Payload for access token
            long currentTimeSeconds = System.currentTimeMillis() / 1000;
            Map<String, Object> payloadAcc = new HashMap<>();
            payloadAcc.put("user-id", userId);
            payloadAcc.put("iat", currentTimeSeconds);
            payloadAcc.put("exp", currentTimeSeconds + (15 * 60));  // 15 minutes

            // 3️⃣ JSON Serialization
            String headerJson = objMp.writeValueAsString(header);
            String payloadJson = objMp.writeValueAsString(payloadAcc);

            // 4️⃣ Base64Url Encoding
            String headerEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));
            String payloadEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));

            // 5️⃣ Create signature
            String dataToSign = headerEncoded + "." + payloadEncoded;
            
            Mac hmacSha512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSha512.init(keySpec);
            byte[] signatureBytes = hmacSha512.doFinal(dataToSign.getBytes(StandardCharsets.UTF_8));
            
            String signatureEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(signatureBytes);

            // 6️⃣ Create complete JWT
            String accessToken = headerEncoded + "." + payloadEncoded + "." + signatureEncoded;
            
            // 7️⃣ Create refresh token (optional but recommended)
            Map<String, Object> payloadRefresh = new HashMap<>();
            payloadRefresh.put("user-id", userId);
            payloadRefresh.put("iat", currentTimeSeconds);
            payloadRefresh.put("exp", currentTimeSeconds + (7 * 24 * 60 * 60)); // 7 days
            
            String payloadRefreshJson = objMp.writeValueAsString(payloadRefresh);
            String payloadRefreshEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payloadRefreshJson.getBytes(StandardCharsets.UTF_8));
            
            String dataToSignRefresh = headerEncoded + "." + payloadRefreshEncoded;
            byte[] signatureBytesRefresh = hmacSha512.doFinal(dataToSignRefresh.getBytes(StandardCharsets.UTF_8));
            String signatureRefreshEncoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(signatureBytesRefresh);
            
            String refreshToken = headerEncoded + "." + payloadRefreshEncoded + "." + signatureRefreshEncoded;

            // 8️⃣ Set both tokens in JWT object
            JWT jwtResponse = new JWT();
            jwtResponse.setAccesstoken(accessToken);
            jwtResponse.setRefreshtoken(refreshToken);
            
            return jwtResponse;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("JWT creation failed");
        }
    }

    public JWT validateToken(JWT jwt){
        String accessToken = jwt.getAccesstoken();
        String refreshToken=jwt.getRefreshtoken();
        
        return jwt;
    }
}
