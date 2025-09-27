package com.booking.Services;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class SeatService {
    private final RedisTemplate<String, Object> redisTemplate;

    public SeatService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Lock multiple seats for a session
    public boolean lockSeats(String sessionId, String userId, List<String> seats, long ttlMinutes) {
        for (String seat : seats) {
            String key = "seat:" + seat;

            // If any seat is already locked, rollback and return false
            if (Boolean.FALSE.equals(redisTemplate.opsForValue().setIfAbsent(key, sessionId, ttlMinutes, TimeUnit.MINUTES))) {
                // Rollback locks
                for (String s : seats) redisTemplate.delete("seat:" + s);
                return false;
            }
        }

        // Save session details
        redisTemplate.opsForHash().put("session:" + sessionId, "userId", userId);
        redisTemplate.opsForHash().put("session:" + sessionId, "seats", String.join(",", seats));
        redisTemplate.expire("session:" + sessionId, ttlMinutes, TimeUnit.MINUTES);

        return true;
    }

    public void releaseSeats(List<String> seats) {
        for (String seat : seats) redisTemplate.delete("seat:" + seat);
    }

    public String getSeatStatus(String seat) {
        return (String) redisTemplate.opsForValue().get("seat:" + seat);
    }
}
