import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CoursesCreatePage({storybook=false}) {

  const objectToAxiosParams = (course) => ({
    url: "/api/courses/post",
    method: "POST",
    params: {
     name: course.name,
     school: course.school,
     term: course.term,
     startDate: course.startDate,
     endDate: course.endDate,
     githubOrg: course.githubOrg
    }
  });

  const onSuccess = (course) => {
    toast(`New Course Created - id: ${course.id} name: ${course.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/courses/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/courses/" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Course</h1>
        <CourseForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
