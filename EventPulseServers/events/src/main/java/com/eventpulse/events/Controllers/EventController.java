package com.eventpulse.events.Controllers;
import org.springframework.web.bind.annotation.RestController;
import com.eventpulse.events.Model.Event;
import com.eventpulse.events.Services.EventServices;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class EventController {
    @Autowired
    private EventServices services;

    @GetMapping("/get-events")
    public  List<Event> getEvents() {
        return services.getEvents();
    }
    @GetMapping("/get-event-details")
    public  List<String> getEventDetails(@RequestParam UUID eventId, @RequestHeader ("refresh-token-exp") String token) {

        return services.getEventSeatStatus(eventId);
    }
    

    @PostMapping("/new-event")
    public String postNewEvent(@RequestBody Event event){
        services.save(event);
        return "Successful";
    }
    @PutMapping("update-event/{id}")
    public Event putUpdatedEvent(@PathVariable UUID id, @RequestBody Event event) {
       return services.findById(id,event);
        
    }
    @DeleteMapping("/delete/{id}")
    public String deleteEvent(@PathVariable UUID id){
        return services.delete(id);

    }
    
    
    
    
}
