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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

@Slf4j
@WebMvcTest(controllers = JobsController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class JobsControllerTests extends ControllerTestCase {

        @Captor
        ArgumentCaptor<Job> jobCaptor;

        @MockBean
        JobsRepository jobsRepository;

        @MockBean
        UserRepository userRepository;

        @Autowired
        JobService jobService;

        @Autowired
        ObjectMapper objectMapper;

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_all_jobs() throws Exception {

                // arrange

                Job job1 = Job.builder().log("this is job 1").build();
                Job job2 = Job.builder().log("this is job 2").build();

                ArrayList<Job> expectedJobs = new ArrayList<>();
                expectedJobs.addAll(Arrays.asList(job1, job2));

                when(jobsRepository.findAll()).thenReturn(expectedJobs);

                // act
                MvcResult response = mockMvc.perform(get("/api/jobs/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(jobsRepository, atLeastOnce()).findAll();
                String expectedJson = mapper.writeValueAsString(expectedJobs);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_get_all_jobs_paged() throws Exception {

                // arrange

                PageRequest pageRequest = PageRequest.of(0, 5);

                Job job1 = Job.builder().log("this is job 1").build();
                Job job2 = Job.builder().log("this is job 2").build();

                ArrayList<Job> expectedJobs = new ArrayList<>();
                expectedJobs.addAll(Arrays.asList(job1, job2));

                Page<Job> expectedJobPage = new PageImpl<>(expectedJobs, pageRequest, expectedJobs.size());

                when(jobsRepository.findAll(any())).thenReturn(expectedJobPage);

                // act
                MvcResult response = mockMvc.perform(get("/api/jobs/all/pageable?page=0&size=10"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(jobsRepository, atLeastOnce()).findAll(any());

                String expectedJson = mapper.writeValueAsString(expectedJobPage);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_test_job() throws Exception {

                // arrange

                User user = currentUserService.getUser();

                Job jobStarted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("running")
                                .log("Hello World! from test job!")
                                .build();

                Job jobCompleted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("complete")
                                .log("Hello World! from test job!\nGoodbye from test job!")
                                .build();

                when(jobsRepository.save(eq(jobStarted))).thenReturn(jobStarted);
                when(jobsRepository.save(eq(jobCompleted))).thenReturn(jobCompleted);

                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=2000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String responseString = response.getResponse().getContentAsString();
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertEquals("running", jobReturned.getStatus());

                await().atMost(5, SECONDS)
                .untilAsserted(() -> {
                        verify(jobsRepository, atLeast(1)).save(jobCaptor.capture());                        
                        List<Job> values = jobCaptor.getAllValues();
                        assertEquals("complete", values.get(0).getStatus(), "first saved job should show running");
                        assertEquals(jobCompleted.getLog(), values.get(0).getLog());
                });
               
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_can_launch_test_job_that_fails() throws Exception {

                // arrange

                User user = currentUserService.getUser();

                Job jobStarted = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("running")
                                .log("Hello World! from test job!")
                                .build();

                Job jobFailed = Job.builder()
                                .id(0L)
                                .createdBy(user)
                                .createdAt(null)
                                .updatedAt(null)
                                .status("error")
                                .log("Hello World! from test job!\nFail!")
                                .build();

                when(jobsRepository.save(eq(jobStarted))).thenReturn(jobStarted);
                when(jobsRepository.save(eq(jobFailed))).thenReturn(jobFailed);

                // act
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=true&sleepMs=2000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                String responseString = response.getResponse().getContentAsString();
                Job jobReturned = objectMapper.readValue(responseString, Job.class);

                assertEquals("running", jobReturned.getStatus());


                await().atMost(16, SECONDS)

                .untilAsserted(() -> {
                        verify(jobsRepository, atLeast(1)).save(jobCaptor.capture());                        
                        List<Job> values = jobCaptor.getAllValues();
                        assertEquals("error", values.get(0).getStatus(), "first saved job should show running");
                        assertEquals(jobFailed.getLog(), values.get(0).getLog());
                });
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_invalid_parameter_minus_1() throws Exception {
                Map<String, String> expectedMap = Map.of(
                                "type", "IllegalArgumentException",
                                "message", "sleepMs must be between 0 and 60000");
                String expected = mapper.writeValueAsString(expectedMap);       
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=-1").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());
                assertEquals(expected, response.getResponse().getContentAsString());
        }

        /**
         * This test is to test one of the boundaries of the sleepMs parameter.
         * A value of 60001 should throw an IllegalArgumentException, which is
         * resolved by the @ExceptionHandler in ApiController.java
         * 
         * @throws Exception
         */
        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_invalid_parameter_60001() throws Exception {
                Map<String, String> expectedMap = Map.of(
                                "type", "IllegalArgumentException",
                                "message", "sleepMs must be between 0 and 60000");
                String expected = mapper.writeValueAsString(expectedMap);       
                MvcResult response = mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=60001").with(csrf()))
                                .andExpect(status().isBadRequest()).andReturn();
                assertInstanceOf(IllegalArgumentException.class, response.getResolvedException());
                assertEquals(expected, response.getResponse().getContentAsString());
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_boundary_parameter_0() throws Exception {
                // boundary are 0 and 60000
                mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=0").with(csrf()))
                                .andExpect(status().isOk()).andReturn();

        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void admin_launch_test_job_with_boundary_parameter_60000() throws Exception {

                mockMvc
                                .perform(post("/api/jobs/launch/testjob?fail=false&sleepMs=60000").with(csrf()))
                                .andExpect(status().isOk()).andReturn();
        }

}