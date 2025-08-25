package com.eventpulse.events.Repository;


import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventpulse.events.Model.Event;

public interface EventRepository extends JpaRepository<Event,UUID> //JPA repository allows CRUD operations/functions in service layer.
{
    
}
