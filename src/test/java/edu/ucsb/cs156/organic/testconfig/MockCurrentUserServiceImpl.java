package edu.ucsb.cs156.organic.testconfig;

import lombok.extern.slf4j.Slf4j;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import java.time.Instant;
import java.util.ArrayList;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.UserEmail;
import edu.ucsb.cs156.organic.services.CurrentUserServiceImpl;
import liquibase.pro.packaged.em;

import static org.mockito.Mockito.when;

@Slf4j
@Service("currentUserMock")
public class MockCurrentUserServiceImpl extends CurrentUserServiceImpl {

  public User getMockUser(SecurityContext securityContext, Authentication authentication) {
    Object principal = authentication.getPrincipal();

    String githubLogin = "cgaucho";
    int githubId = 12345;
    String email = "user@example.org";
    String pictureUrl = "https://example.org/fake.jpg";
    String fullName = "Fake User";
    boolean emailVerified = true;
    boolean admin=false;
    Instant lastOnline = Instant.ofEpochSecond(100);

    org.springframework.security.core.userdetails.User user = null;


    if (principal instanceof org.springframework.security.core.userdetails.User) {
      log.info("principal instance of org.springframework.security.core.userdetails.User");
      user = (org.springframework.security.core.userdetails.User) principal;
      email = user.getUsername() + "@example.org";
      pictureUrl = "https://example.org/" +  user.getUsername() + ".jpg";
      fullName = "Fake " + user.getUsername();
      emailVerified = true;
      admin = false;
    } 

    User u = User.builder()
    .githubLogin(githubLogin)
    .email(email)
    .pictureUrl(pictureUrl)
    .fullName(fullName)
    .emailVerified(emailVerified)
    .admin(admin)
    .githubId(githubId)
    .lastOnline(lastOnline)
    .build();

    User userSpy = spy(u);
  
    ArrayList<UserEmail> emails = new ArrayList<UserEmail>();
    UserEmail userEmail = UserEmail.builder().email("cgaucho@ucsb.edu").user(userSpy).build();
    emails.add(userEmail);   

    when(userSpy.getEmails()).thenReturn(emails);
   

    log.trace("************** ALERT **********************");
    log.trace("************* MOCK USER********************");
    log.trace("authentication={}",authentication);
    log.trace("securityContext={}",securityContext);
    log.trace("principal={}",principal);
    log.trace("user (spring security) ={}",user);
    log.trace("u (our custom user entity)={}",userSpy);
    log.trace("************** END ALERT ******************");

    return userSpy;
  }

  public User getUser() {
    SecurityContext securityContext = SecurityContextHolder.getContext();
    Authentication authentication = securityContext.getAuthentication();

    if (!(authentication instanceof OAuth2AuthenticationToken)) {
      return getMockUser(securityContext, authentication);
    }

    return null;
  }

}
