import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';

export default function CoursesIndexPage() {

  const { data: currentUser } = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
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
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: "/api/courses/all" },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Courses</h1>
          <CoursesTable courses={courses} currentUser={currentUser} />
        </div>
      </BasicLayout>
    )
}