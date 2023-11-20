package edu.ucsb.cs156.organic.config;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

/**
 * This class is used to configure Spring Security.
 * 
 * Among other things, this class is partially responsible for
 * the implementation of the ADMIN_GITHUB_LOGINS feature.
 */

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Slf4j
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Value("${app.admin.githubLogins}")
  private final List<String> adminGithubLogins = new ArrayList<String>();

  @Value("${spring.security.oauth2.client.registration.github.client-id}")
  private String clientId;

  @Value("${spring.security.oauth2.client.registration.github.client-secret}")
  private String clientSecret;

  @Autowired
  UserRepository userRepository;

  // @Autowired
  // private LoginSuccessHandler loginSuccessHandler;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests(authorize -> authorize
        .anyRequest()
        .permitAll())
        .exceptionHandling(handlingConfigurer -> handlingConfigurer
            .authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
        .oauth2Login(
            oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userAuthoritiesMapper(this.userAuthoritiesMapper())))
        .csrf(csrf -> csrf
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
        .logout(logout -> logout
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/"));
  }

  @Override
  public void configure(WebSecurity web) throws Exception {
    web.ignoring().antMatchers("/h2-console/**");
  }

  private GrantedAuthoritiesMapper userAuthoritiesMapper() {
    return (authorities) -> {
      Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

      authorities.forEach(authority -> {
        log.trace("********** authority={}", authority);
        mappedAuthorities.add(authority);
        if (OAuth2UserAuthority.class.isInstance(authority)) {
          OAuth2UserAuthority oauth2UserAuthority = (OAuth2UserAuthority) authority;

          Map<String, Object> userAttributes = oauth2UserAuthority.getAttributes();
          log.trace("********** userAttributes={}", userAttributes);

          String githubLogin = (String) userAttributes.get("login");
          boolean userIsAdmin = updateAdmin(githubLogin);
          if (userIsAdmin) {
            mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
          }
          // if (getInstructor(githubLogin)){
          //   mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_INSTRUCTOR"));
          // }
        }

      });
      return mappedAuthorities;
    };
  }

  public boolean updateAdmin(String githubLogin) {
    if (adminGithubLogins.contains(githubLogin)) {
      return true;
    }
    Optional<User> u = userRepository.findByGithubLogin(githubLogin);
    boolean result = u.isPresent() && u.get().isAdmin();
    if (result) {
      User user = u.get();
      user.setAdmin(true);
      userRepository.save(user);
    }
    return result;
  }
}