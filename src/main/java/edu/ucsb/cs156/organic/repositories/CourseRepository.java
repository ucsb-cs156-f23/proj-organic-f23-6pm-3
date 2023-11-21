package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.Course;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends CrudRepository<Course, Integer> {

   public Optional<Course> findById(Long id);

   @Query("select c from courses c where c.id in (select cs.courseId from staff cs where cs.githubId = :githubId)")
   public Iterable<Course> findCoursesStaffedByUser(Integer githubId);



   /**
    * return 1 if user is on the staff of this course, otherwise is 0
    */
   @Query("select count(c) from courses c where c.id in (select cs.courseId from staff cs where cs.githubId = :githubId and c.id = :courseId)")
   public int countOfMatchingCourses(Integer githubId, Long courseId);
}
