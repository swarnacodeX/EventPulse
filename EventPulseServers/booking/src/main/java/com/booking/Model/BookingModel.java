package com.booking.Model;

import java.util.ArrayList;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Bookings")
public class BookingModel {
    
    @Column(name="userId", nullable=false)
    private UUID userId;
    @Column(name="email", nullable=false)
    private String email;
    @Column(name="seatsbooked", nullable=false)
    private ArrayList<String> seats;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bId;
    @Column(name="eventId", nullable=false)
    private UUID eventId;
    

    public UUID getUserId(){
        return userId;
    }
    public void setUserId(UUID userId){
        this.userId=userId;
    }
    public String getEmail(){
        return email;
    }
    public ArrayList<String> getSeats(){
        return seats;
    }
    public void setSeat(String seat){
        this.seats.add(seat);
    }
    public UUID getBid(){
        return bId;
    }
    public void setBId(UUID bId){
        this.bId=bId;
    }
    public UUID getEventId(){
        return eventId;
    }
}
