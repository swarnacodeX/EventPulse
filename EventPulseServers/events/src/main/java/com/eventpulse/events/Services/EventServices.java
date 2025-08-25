package com.eventpulse.events.Services;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.eventpulse.events.Model.Event;
import com.eventpulse.events.Repository.EventRepository;
@Component
public class EventServices {
    @Autowired
    private EventRepository eventRepository;

    public List<Event> getEvents(){
        return eventRepository.findAll();
    }
    public Event save(Event event) {
        return eventRepository.save(event);
    }
    public Event findById(UUID id, Event event){
        eventRepository.findById(id)
        .ifPresent(newEvent->{
            newEvent.setEventName(event.getEventName());
            newEvent.setEventDate(event.getEventDate());
            newEvent.setArtists(event.getArtists());
            newEvent.setSponsors(event.getSponsors());
            newEvent.setVenue(event.getVenue());
            eventRepository.save(newEvent);
        });
        return event;

    }
    public String delete(UUID id) {
        
        eventRepository.deleteById(id);
        return "Successful";

    }


}
