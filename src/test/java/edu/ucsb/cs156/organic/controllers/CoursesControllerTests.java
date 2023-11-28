package edu.ucsb.cs156.organic.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.awaitility.Awaitility.await;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.organic.entities.Course;
import edu.ucsb.cs156.organic.entities.Staff;
import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.repositories.CourseRepository;
import edu.ucsb.cs156.organic.repositories.StaffRepository;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

@Slf4j
@WebMvcTest(controllers = CoursesController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class CoursesControllerTests extends ControllerTestCase {

        @MockBean
        UserRepository userRepository;

        @MockBean
        CourseRepository courseRepository;

        @MockBean
        StaffRepository courseStaffRepository;

        @Autowired
        ObjectMapper objectMapper;

        Course testcourse_1 = Course.builder()
                        .id(1L)
                        .name("CS156")
                        .school("UCSB")
                        .term("F23")
                        .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                        .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                        .githubOrg("ucsb-cs156-f23")
                        .build();

        Course testcourse_2 = Course.builder()
                        .id(1L)
                        .name("PSTAT131")
                        .school("UCSB")
                        .term("M24")
                        .start(LocalDateTime.parse("2029-01-01T00:00:00"))
                        .end(LocalDateTime.parse("2029-03-31T00:00:00"))
                        .githubOrg("ucsb-PSTAT131-w24")
                        .build();
                        
        Course course1 = Course.builder()
                        .id(1L)
                        .name("CS156")
                        .school("UCSB")
                        .term("F23")
                        .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                        .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                        .githubOrg("ucsb-cs156-f23")
                        .build();

        Course course2 = Course.builder()
                        .id(1L)
                        .name("CS148")
                        .school("UCSB")
                        .term("S24")
                        .start(LocalDateTime.parse("2024-01-01T00:00:00"))
                        .end(LocalDateTime.parse("2024-03-31T00:00:00"))
                        .githubOrg("ucsb-cs148-w24")
                        .build();

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_all_courses() throws Exception {

                // arrange

                ArrayList<Course> expectedCourses = new ArrayList<>();
                expectedCourses.addAll(Arrays.asList(testcourse_1, testcourse_2));

                when(courseRepository.findAll()).thenReturn(expectedCourses);

                // act
                MvcResult response = mockMvc.perform(get("/api/courses/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(courseRepository, atLeastOnce()).findAll();
                String expectedJson = mapper.writeValueAsString(expectedCourses);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void user_can_get_only_courses_for_which_they_are_staff() throws Exception {

                // arrange

                ArrayList<Course> expectedCourses = new ArrayList<>();
                expectedCourses.addAll(Arrays.asList(testcourse_1, testcourse_2));

                when(courseRepository.findCoursesStaffedByUser(any())).thenReturn(expectedCourses);

                // act
                MvcResult response = mockMvc.perform(get("/api/courses/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(courseRepository, atLeastOnce()).findCoursesStaffedByUser(any());
                String expectedJson = mapper.writeValueAsString(expectedCourses);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_course() throws Exception {
                // arrange

                Course courseBefore = Course.builder()
                                .name("CS9")
                                .school("UCSB")
                                .term("F23")
                                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                                .githubOrg("ucsb-cs9-f23")
                                .build();

                Course courseAfter = Course.builder()
                                .id(222L)
                                .name("CS9")
                                .school("UCSB")
                                .term("F23")
                                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                                .githubOrg("ucsb-cs9-f23")
                                .build();

                when(courseRepository.save(eq(courseBefore))).thenReturn(courseAfter);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/courses/post?name=CS9&school=UCSB&term=F23&start=2023-09-01T00:00:00&end=2023-12-31T00:00:00&githubOrg=ucsb-cs9-f23")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(courseRepository, times(1)).save(courseBefore);
                String expectedJson = mapper.writeValueAsString(courseAfter);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_add_a_staff_member_to_a_course() throws Exception {
                // arrange

                User user = User.builder().githubId(12345).githubLogin("scottpchow23").build();

                Staff courseStaffBefore = Staff.builder()
                                .courseId(testcourse_1.getId())
                                .githubId(user.getGithubId())
                                .user(user)
                                .build();

                Staff courseStaffAfter = Staff.builder()
                                .id(456L)
                                .courseId(testcourse_1.getId())
                                .githubId(user.getGithubId())
                                .user(user)
                                .build();

                when(courseRepository.findById(eq(testcourse_1.getId()))).thenReturn(Optional.of(testcourse_1));
                when(userRepository.findByGithubLogin(eq("scottpchow23"))).thenReturn(Optional.of(user));
                when(courseStaffRepository.save(eq(courseStaffBefore))).thenReturn(courseStaffAfter);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/courses/addStaff?courseId=1&githubLogin=scottpchow23")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(courseStaffRepository, times(1)).save(courseStaffBefore);
                String expectedJson = mapper.writeValueAsString(courseStaffAfter);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_add_staff_to_a_non_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
                // act

                MvcResult response = mockMvc.perform(
                                post("/api/courses/addStaff?courseId=42&githubLogin=scottpchow23")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_add_non_existing_user_to_staff_of_an_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(testcourse_1.getId()))).thenReturn(Optional.of(testcourse_1));
                when(userRepository.findByGithubLogin(eq("sadGaucho"))).thenReturn(Optional.empty());
               
                // act

                MvcResult response = mockMvc.perform(
                                post("/api/courses/addStaff?courseId=1&githubLogin=sadGaucho")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "User with id sadGaucho not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }



        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_get_staff_for_a_course() throws Exception {
                // arrange

                User user1 = User.builder().githubId(12345).githubLogin("scottpchow23").build();
                User user2 = User.builder().githubId(67890).githubLogin("pconrad").build();

                Staff courseStaff1 = Staff.builder()
                                .id(111L)
                                .courseId(testcourse_1.getId())
                                .githubId(user1.getGithubId())
                                .user(user1)
                                .build();

                Staff courseStaff2 = Staff.builder()
                                .id(222L)
                                .courseId(testcourse_2.getId())
                                .githubId(user2.getGithubId())
                                .user(user2)
                                .build();

                ArrayList<Staff> expectedCourseStaff = new ArrayList<>();
                expectedCourseStaff.addAll(Arrays.asList(courseStaff1, courseStaff2));

                when(courseRepository.findById(eq(testcourse_1.getId()))).thenReturn(Optional.of(testcourse_1));
                when(courseStaffRepository.findByCourseId(eq(testcourse_1.getId()))).thenReturn(expectedCourseStaff);

                // act

                MvcResult response = mockMvc.perform(
                                get("/api/courses/getStaff?courseId=1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(courseStaffRepository, times(1)).findByCourseId(eq(testcourse_1.getId()));
                String expectedJson = mapper.writeValueAsString(expectedCourseStaff);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_get_staff_for_a_non_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
                // act

                MvcResult response = mockMvc.perform(
                                get("/api/courses/getStaff?courseId=42")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_update_a_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(114514))).thenReturn(Optional.empty());
                // act

                MvcResult response = mockMvc.perform(
                                get("/api/courses/getStaff?courseId=114514")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "Course with id 114514 not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }
        //Test for PUT
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_update_an_existing_course() throws Exception {
                // arrange

                User user = currentUserService.getCurrentUser().getUser();

                Staff courseStaff1 = Staff.builder()
                                .id(111L)
                                .courseId(course1.getId())
                                .githubId(user.getGithubId())    
                                .user(user)
                                .build();

                Course courseAfter = Course.builder()
                                .id(1L)
                                .name("CS36")
                                .school("TUCSB")
                                .term("M25")
                                .start(LocalDateTime.parse("2024-09-01T00:00:00"))
                                .end(LocalDateTime.parse("2025-12-31T00:00:00"))
                                .githubOrg("ucsb-cs36-m25")
                                .build();

                String requestBody = mapper.writeValueAsString(courseAfter);

                when(courseStaffRepository.findByCourseIdAndGithubId(eq(course1.getId()),eq(courseStaff1.getGithubId()))).thenReturn(Optional.of(courseStaff1));
                when(courseRepository.findById(eq(course1.getId()))).thenReturn(Optional.of(course1));
               

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/courses/update?courseId=1")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(courseStaffRepository, times(1)).findByCourseIdAndGithubId(eq(course1.getId()),eq(courseStaff1.getGithubId()));
                verify(courseRepository, times(1)).findById(1L);
                verify(courseRepository, times(1)).save(courseAfter); 
                
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_course_that_does_not_exist() throws Exception {
                // arrange

                Course course = Course.builder()
                                .id(67L)
                                .name("CS16")
                                .school("TUCSB")
                                .term("F23")
                                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                                .githubOrg("ucsb-cs16-f23")
                                .build();

                String requestBody = mapper.writeValueAsString(course);

                when(courseRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/courses/update?courseId=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(courseRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Course with id 67 not found", json.get("message"));

        }
        
        @WithMockUser(roles = { "INSTRUCTOR" })
        @Test
        public void nonstaff_cannot_edit_an_existing_course() throws Exception {
                // arrange

                User user1 = User.builder().githubId(12345).githubLogin("not-cgaucho").build();

                Staff courseStaff1 = Staff.builder()
                                .id(111L)
                                .courseId(1L)
                                .githubId(user1.getGithubId())
                                .user(user1)
                                .build();

                ArrayList<Staff> expectedCourseStaff = new ArrayList<>();
                expectedCourseStaff.addAll(Arrays.asList(courseStaff1));

                Course courseAfter = Course.builder()
                                .id(1L)
                                .name("CS36")
                                .school("TUCSB")
                                .term("M25")
                                .start(LocalDateTime.parse("2024-09-01T00:00:00"))
                                .end(LocalDateTime.parse("2025-12-31T00:00:00"))
                                .githubOrg("ucsb-cs36-m25")
                                .build();

                String requestBody = mapper.writeValueAsString(courseAfter);

                when(courseRepository.findById(eq(course1.getId()))).thenReturn(Optional.of(course1));
                when(courseStaffRepository.findByCourseId(eq(course1.getId()))).thenReturn(expectedCourseStaff);

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/courses/update?courseId=1")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isForbidden()).andReturn();

                // assert
                verify(courseRepository, times(1)).findById(1L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("cgaucho is not allowed to update course 1", json.get("message"));
        }



        // Tests for GET by ID

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/courses?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void test_that_admin_can_get_by_id_when_the_id_exists() throws Exception {

                when(courseRepository.findById(eq(7L))).thenReturn(Optional.of(testcourse_1));

                // act
                MvcResult response = mockMvc.perform(get("/api/courses?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(courseRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(testcourse_1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void test_that_admin_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                when(courseRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/courses?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(courseRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Course with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void nonadmin_staff_can_get_an_existing_course() throws Exception {
                // arrange
                User currentUser = currentUserService.getCurrentUser().getUser();

                Staff courseStaff1 = Staff.builder()
                                .id(111L)
                                .courseId(testcourse_1.getId())
                                .githubId(currentUser.getGithubId())
                                .user(currentUser)
                                .build();

                when(courseRepository.findById(eq(testcourse_1.getId()))).thenReturn(Optional.of(testcourse_1));
                when(courseStaffRepository.findByCourseIdAndGithubId(eq(testcourse_1.getId()),
                                eq(courseStaff1.getGithubId()))).thenReturn(Optional.of(courseStaff1));

                // act
                MvcResult response = mockMvc.perform(get("/api/courses?id=1"))
                                .andExpect(status().isOk()).andReturn();


                // assert
                verify(courseRepository, times(1)).findById(eq(1L));
                verify(courseStaffRepository, times(1)).findByCourseIdAndGithubId(eq(testcourse_1.getId()),
                                eq(courseStaff1.getGithubId()));
                String expectedJson = mapper.writeValueAsString(testcourse_1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
         
        @WithMockUser(roles = { "USER" })
        @Test
        public void nonadmin_nonstaff_cant_get_an_existing_course() throws Exception {
            // arrange
            User currentUser = currentUserService.getCurrentUser().getUser();
        
            when(courseRepository.findById(eq(testcourse_1.getId()))).thenReturn(Optional.of(testcourse_1));
        
            // act
            mockMvc.perform(get("/api/courses?id=1"))
                   .andExpect(status().isForbidden());
        
            // assert
            verify(courseRepository, times(1)).findById(eq(1L));
        }
}

