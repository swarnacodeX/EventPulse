package com.booking.Controllers;

import com.booking.Services.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/booking")
public class BookingController {
    private final SeatService seatService;

    public BookingController(SeatService seatLockService) {
        this.seatService = seatLockService;
    }
    @PostMapping("/book")
    public String postMethodName(@RequestParam UUID eventId, @RequestParam UUID userId  ) {
        
        
        return userId.toString();
    }
    
    @PostMapping("/lock")
    public String lockSeats(@RequestParam String sessionId,
                            @RequestParam String userId,
                            @RequestBody List<String> seats) {
        boolean locked = seatService.lockSeats(sessionId, userId, seats, 10); // 10 min
        return locked ? "Seats locked for session " + sessionId : "Failed! Some seats already locked.";
    }

    @PostMapping("/unlock")
    public String unlockSeats(@RequestBody List<String> seats) {
        seatService.releaseSeats(seats);
        return "Seats unlocked";
    }

    @GetMapping("/status/{seat}")
    public String getSeatStatus(@PathVariable String seat) {
        String holder = seatService.getSeatStatus(seat);
        return holder != null ? "Locked by session " + holder : "Available";
    }
}
