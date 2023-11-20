package edu.ucsb.cs156.organic.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import liquibase.pro.packaged.u;
import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.Parameter;
import javax.persistence.EntityNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;




@Tag(name = "User information (admin only)")
@RequestMapping("/api/admin/users")
@RestController
public class UsersController extends ApiController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Get a list of all users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<String> users()
            throws JsonProcessingException {
        Iterable<User> users = userRepository.findAll();
        String body = mapper.writeValueAsString(users);
        return ResponseEntity.ok().body(body);
    }


    // ADDED CODE BELOW: 


    @Operation(summary = "Toggle the admin field")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/toggleAdmin")
    public Object toggleAdmin( @Parameter(name = "githubId", description = "Integer, id number of user to toggle their admin field", example = "1", required = true) @RequestParam Integer githubId){
        User user = userRepository.findByGithubId(githubId)
        // .orElseThrow(() -> new EntityNotFoundException(User.class, githubId));
        .orElseThrow(() ->  new EntityNotFoundException("User not found with GITHUB ID: " + githubId));
        // COME BACK AND FIX THIS!! ^^ 

        user.setAdmin(!user.isAdmin());
        userRepository.save(user);
        return genericMessage("User with id %s has toggled admin status to %s".formatted(githubId, user.isAdmin()));
    }


    // @Operation(summary = "Toggle the Instructor field")
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    // @PostMapping("/toggleInstructor")
    // public Object toggleInstructor( @Parameter(name = "githubId", description = "Integer, id number of user to toggle their instructor field", example = "1", required = true) @RequestParam Integer githubId){

    //     User user = userRepository.findById(githubId)
    //     .orElseThrow(() -> new EntityNotFoundException(User.class, githubId));

    //     user.setIntrstructor(!user.isInstructor());
    //     userRepository.save(user);
    //     return genericMessage("User with id %s has toggled instructor status to %s".formatted(githubId, user.isInstructor()));
    // }
}