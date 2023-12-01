package edu.ucsb.cs156.organic.controllers;

import edu.ucsb.cs156.organic.entities.Course;
import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.UserEmail;
import edu.ucsb.cs156.organic.models.CurrentUser;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

@Slf4j
@Tag(name = "Current User Information")
@RequestMapping("/api/currentUser")
@RestController
public class UserInfoController extends ApiController {
  @Autowired
  private UserRepository userRepository;

  @Operation(summary = "Get information about current user")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public ResponseEntity<String> getCurrentUserAsJson() throws JsonProcessingException {
    CurrentUser cu = super.getCurrentUser();
    String cuAsJson = getMapper().writeValueAsString(cu);
    return ResponseEntity.ok().body(cuAsJson);
  }

  @Operation(summary = "Update user's last online time")
  @PreAuthorize("hasRole('ROLE_USER')")
  @PostMapping("/last-online")
  public ResponseEntity<Instant> updateLastOnline() {
    User user = super.getCurrentUser().getUser();
    Instant timeNow = Instant.now();
    user.setLastOnline(timeNow);
    userRepository.save(user);
    return ResponseEntity.ok().body(timeNow);
  }

  @Operation(summary = "Get current users emails")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/emails")
  public Iterable<UserEmail> getUsersEmails() {
    User user = super.getCurrentUser().getUser();
    return user.getEmails();
  }

  
  @Operation(summary = "Get courses for which current user is on the staff")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/staffedCourses")
  public Iterable<Course> getStaffedCourses() {
    User user = super.getCurrentUser().getUser();
    return userRepository.findCoursesStaffedByUser(user.getGithubId());  
  }

}
