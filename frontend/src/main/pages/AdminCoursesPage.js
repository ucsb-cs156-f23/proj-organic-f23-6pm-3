import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PagedCourseTable from "main/components/Courses/PagedCourseTable"
import Accordion from "react-bootstrap/Accordion"
import TestCourseForm from "main/components/Courses/TestCourseForm"
import { toast } from "react-toastify";

import { useBackendMutation } from "main/utils/useBackend";

const CourseIndexPage = () => {

    // *** Test course ***

    const objectToAxiosParamsTestCourse = (data) => ({
        url: `/api/courses/launch/testcourse?fail=${data.fail}&sleepMs=${data.sleepMs}`,
        method: "POST",
    });

    // Stryker disable all
    const testCourseMutation = useBackendMutation(objectToAxiosParamsTestCourse, {}, [
        "/api/courses/all",
    ]);
    // Stryker restore all

    const submitTestCourse = async (data) => {
        toast("Submitted course: Test Course");
        testCourseMutation.mutate(data);
    };

    const courseLaunchers = [
        {
            name: "Test Course",
            form: <TestCourseForm submitAction={submitTestCourse} />
        },
    ];

    return (
        <BasicLayout>
          <h2 className="p-3">Launch Courses</h2>
          <Accordion>
            {courseLaunchers.map((courseLauncher, index) => (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>{courseLauncher.name}</Accordion.Header>
                <Accordion.Body>{courseLauncher.form}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
      
          <h2 className="p-3">Course Status</h2>
          <PagedCourseTable />
        </BasicLayout>
    );
};

export default CourseIndexPage;