package edu.ucsb.cs156.organic.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.jobs.TestJob;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.jobs.JobService;


@Tag(name = "Jobs")
@RequestMapping("/api/jobs")
@RestController
public class JobsController extends ApiController {
    @Autowired
    private JobsRepository jobsRepository;

    @Autowired
    private JobService jobService;


    @Autowired
    ObjectMapper mapper;


    @Operation(summary = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public Iterable<Job> allJobs() {
        Iterable<Job> jobs = jobsRepository.findAll();
        return jobs;
    }

    @Operation(summary = "List all jobs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all/pageable")
    public Page<Job> allJobsPaged(
         @Parameter(name="page") @RequestParam int page,
         @Parameter(name="size") @RequestParam int size
    ) {
        Page<Job> jobs = jobsRepository.findAll(PageRequest.of(page, size, Sort.by("id").descending()));
        return jobs;
    }

    @Operation(summary = "Launch Test Job (click fail if you want to test exception handling)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/launch/testjob")
    public Job launchTestJob(
        @Parameter(name="fail") @RequestParam Boolean fail, 
        @Parameter(name="sleepMs") @RequestParam Integer sleepMs
    ) {
        TestJob testJob = TestJob.builder()
        .fail(fail)
        .sleepMs(sleepMs)
        .build();

        // Reference: frontend/src/components/Jobs/TestJobForm.js
        if (sleepMs < 0 || sleepMs > 200000) {
            throw new IllegalArgumentException("sleepMs must be between 0 and 200000");
        }

        return jobService.runAsJob(testJob);
    }
}
