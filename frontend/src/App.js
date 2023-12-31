import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react"
import { useBackendMutation } from "main/utils/useBackend";
import HomePage from "main/pages/HomePage";
import LoadingPage from "main/pages/LoadingPage";
import LoginPage from "main/pages/LoginPage";
import ProfilePage from "main/pages/ProfilePage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminJobsPage from "main/pages/AdminJobsPage";

import CoursesIndexPage from "main/pages/Courses/CoursesIndexPage";
import CoursesCreatePage from "main/pages/Courses/CoursesCreatePage";
import CoursesEditPage from "main/pages/Courses/CoursesEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";
import NotFoundPage from "main/pages/NotFoundPage";


function App() {
  const { data: currentUser } = useCurrentUser();

  const adminRoutes = hasRole(currentUser, "ROLE_ADMIN") ? (
    <>
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
    </>
  ) : null;

  const userRoutes = hasRole(currentUser, "ROLE_USER") ? (
    <>
      <Route path="/profile" element={<ProfilePage />} />
    </>
  ) : null;

  const courseRoutes = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) ? (
    <>
      <Route path="/courses" element={<CoursesIndexPage />} />
      <Route path="/courses/edit/:id" element={<CoursesEditPage />} />
      <Route path="/courses/create" element={<CoursesCreatePage />} />
    </>
  ) : null;

  const homeRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER")) 
    ? <Route path="/" element={<HomePage />} /> 
    : <Route path="/" element={<LoginPage />} />;

  /*  Display the LoadingPage while awaiting currentUser 
      response to prevent the NotFoundPage from displaying */
      
  const updateLastOnlineMutation = useBackendMutation(
    () => ({ method: 'POST', url: '/api/currentUser/last-online' }),
    {}
  );

  const updatedOnlineOnMount = useRef(false);

  useEffect(() => {
    if (currentUser && currentUser.loggedIn) {
      if (!updatedOnlineOnMount.current) {
        updatedOnlineOnMount.current = true;
        updateLastOnlineMutation.mutate();
      }
      
      const interval = setInterval(() => {
        updateLastOnlineMutation.mutate();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentUser, updateLastOnlineMutation]);

  return (
    <BrowserRouter>
      {currentUser?.initialData ? ( <LoadingPage /> ) : ( 
        <Routes>
          {homeRoute}
          {adminRoutes}
          {courseRoutes}
          {userRoutes}
          <Route path="*" element={<NotFoundPage />} />
          {
            hasRole(currentUser, "ROLE_USER") && (
              <>
                <Route path="/courses" element={<CoursesIndexPage />} />
              </>
            )
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && (
              <>
                <Route path="/courses/edit/:id" element={<CoursesEditPage />} />
              </>
            )
          }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/courses/create" element={<CoursesCreatePage />} />
            </>
          )
        }
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;