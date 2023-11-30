import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

// Placeholder for Course Index Page, jump to here after hitting submit for Create Page
export default function CoursesIndexPage() {

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p><a href="/courses/create">Create</a></p>
        <p><a href="/courses/edit/1">Edit</a></p>
      </div>
    </BasicLayout>
  )
}