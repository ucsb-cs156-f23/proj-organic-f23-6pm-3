import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';

export default function CourseIndexPage() {
  
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/courses/create"
          style={{ float: "right"}}
        >
          Create Course
        </Button>
      )
    }
  }

  const { data: courses, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/courses/all"],
      { method: "GET", url: "/api/courses/all"},
      []
    )
  
  //if (hasRole(currentUser, "ROLE_ADMIN" || "ROLE_INSTRUCTOR")) {
    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Courses</h1>
          <CoursesTable courses={courses} currentUser={currentUser} />
        </div>
      </BasicLayout>
    );
  //}
  
}