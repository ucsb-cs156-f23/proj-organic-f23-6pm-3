package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Staff;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends CrudRepository<Staff, Integer> {
    Iterable<Staff> findByCourseId(Long courseId);
    Iterable<Staff> findByGithubId(Integer githubId);
    Optional<Staff> findById(Long id);
    Optional<Staff> findByCourseIdAndGithubId(Long courseId, Integer githubId);
}
