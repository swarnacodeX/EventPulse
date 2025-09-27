package com.booking.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.booking.Model.BookingModel;

public interface BookingRepository  extends JpaRepository<BookingModel,UUID>{

}
