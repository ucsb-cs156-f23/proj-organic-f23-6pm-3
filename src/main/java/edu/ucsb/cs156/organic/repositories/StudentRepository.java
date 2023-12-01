package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Student;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends CrudRepository<Student, Integer> {
    Iterable<Student> findByCourseId(Long courseId);
    Iterable<Student> findByGithubId(Integer githubId);
    Optional<Student> findById(Long id);
    Optional<Student> findByCourseIdAndStudentId(Long courseId, String studentId);
}
