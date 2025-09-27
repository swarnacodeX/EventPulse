package com.booking.Model;

import java.util.UUID;

public class PaymentModel {
    private UUID paymentId;
    private Integer amount;
    private UUID bookingId;


    public UUID getPaymentId(){
        return paymentId;
    }

    public void setPaymentId(UUID paymentId){
        this.paymentId=paymentId;
    }
    public void setAmount(Integer amount){
        this.amount=amount;
    }
    public Integer getAmount(){
        return amount;
    }
    public UUID getBookingId(){
        return bookingId;
    }
    public void setBookingId(UUID bookingId){
        this.bookingId=bookingId;
    }
}
