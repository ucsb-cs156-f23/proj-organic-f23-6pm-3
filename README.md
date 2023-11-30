# ucsb-cs156/proj-organic

# Deployments

| Type | Link       | 
|------|------------|
| prod | <https://organic.dokku-07.cs.ucsb.edu/>     | 
| qa   | <https://organic-qa.dokku-07.cs.ucsb.edu/>  | 

# Description

This is a full rewrite of the application <https://github.com/brownfield-team/anacapa-github-linker>, which has been deployed
as <https://ucsb-cs-github-linker.herokuapp.com> for several years.


The application provides instructional staff and students the ability to 
work with Github Organizations for courses. 

# Core MVP Features

This epic contains the features that replace the core functions of
managing course rosters; all of the instructors currently using the tool need this feature set.  Further, for most current users (e.g. for UCSB courses CMPSC 9, 16, 24, 32, 148), this feature set is sufficient to meet current needs.

This matches current functionality with one exception, where we are fixing a design flaw in the original app: instead of treating "staff" as a special case of students, having staff is built in right from the start as a specific feature.

* Any user can log in with their github id (i.e. the application uses Github id for OAuth) (DONE)
* Initial Admin users are specified in the ADMIN_GITHUB_LOGINS (DONE)
* Admin can be designated by other admins (similar to how it works in https://github.org/ucsb-cs156/proj-gauchoride). (https://github.com/ucsb-cs156/proj-organic/issues/20)
* Admin users can designate other users as admins or instructors. (https://github.com/ucsb-cs156/proj-organic/issues/20)
* Admins and Instructors can create courses. (https://github.com/ucsb-cs156/proj-organic/issues/21)
* An instructor can create a course and link it to a Github organization.  The course start and end dates will be required (unlike the current app where they are optional) (https://github.com/ucsb-cs156/proj-organic/issues/21).
* The instructor that creates a course is automatically a member of that courses staff, which provides certain privileges for that course. (https://github.com/ucsb-cs156/proj-organic/issues/21)
* An instructor can do CRUD operations on additional course staff adding them by github id.  Those users have the same privileges as the original instructors.  (This is for TAs and other course helpers; if it is needed at some point to differentiate levels of privilege, we'll build that when we need it.  For now, there is just
admin, and in the context of a given course, instructor or student.) (https://github.com/ucsb-cs156/proj-organic/issues/21)
* An instructor can upload a course roster from a CSV file; that roster can then be browsed as a table. 
* An instructor can also do CRUD operations on individual students on the student roster.
* Students, after logging in with their github see a list of courses that are available to join as a student; unlike the current linker, it will only list courses that are (a) active (i.e. it is between the start/end dates) AND that have that users email on the roster.
* Users will also see a list of courses that are available to join as a staff member.  The logic is the same, except instead of consulting the student roster, it consults the staff roster.
* Students can click to join a course organization; if their email matches one on the roster, they are invited to join the organization.  If not, they are shown a suitable error message.

# Repo Creation
 
The next set of features is for individual repo creation, and matches current functionality.

* An instructor can enter the name of an assignment, e.g. lab01, a visibility (public/private) and a level of control for the student (read-only, read/write, admin)
* A repo will be created for every student / staff member (see below) with the pattern lab01-githubid
* There are three options: students only, staff only, both students and staff.

# Team Creation

This is an existing feature, but enhanced based on experience with the MVP feature in the current app.

* An instructor can upload a CSV with student ids, and teamnames.  The tool will store this mapping; in particular, it will store a table of teams, 
and a table that maps roster students to teams.
* The instructor can edit the team assignments in the tool.
* There is a job that pushes the teams to the Github organization; this will do the following (a) for any team mentioned in the file that isn't on Github, it will create that team on github (b) for any student in the roster that has a team assignment, it will add the student to that team on github.  (Note that it isn't possible to add someone to the team on github if we don't currently have the github id for that student.)
* There is also a job that pulls team assignments from github.  Any team that exists on github that doesn't exist in the team list in the app will be added to the list of teams in the app.   Any team membership that exists on Github and doesn't exist in the app will be added.  There is an option on the job that allows the instructor running it to specify whether the pull should be (a) add only, i.e. add member to team in the app, if the user is a member of the team on github, (b) add/delete: i.e. make the team memberships in the app reflect exactly what's on github.

# Team repo creation

* Staff will be able to create repos for teams (as in the current tool)

# New features 

* Any instructor can quickly a list of email addresses of students that appear on the roster, but have not yet logged into the tool with their github id.  This allows the staff member to email those students with a reminder and the instructions.

* For any individual assignment repo  (perhaps specified by regular expression?), the staff will be able to see a report of activity on those repos: the number of commits, the date/time of the most recent commit.  Other statistics may be added to this report over time.  The report should list repo name (as link to repo), student name, student id, student email, # of commits, date/time of most recent commit.

* For any team repo, (perhaps specified by regular expression?), the staff will be able to see a report of activity on those team repos: the name of the repo (as a link to the repo), plus, if the repo is linked to exactly one project, a link to that project.  (If linked to more than one project, the link shows "[multiple projects]" and is a link to the list of those on Github.)


# Configuration

The GitHub actions script to deploy the Storybook to QA requires some configuration; see [docs/github-actions.md](docs/github-actions.md) for details.

If these repos are not yet setup, see the setup steps in [`docs/storybook.md`](docs/storybook.md).


# Setup before running application

Before running the application for the first time,
you need to do the steps documented in [`docs/oauth.md`](docs/oauth.md).

Otherwise, when you try to login for the first time, you
will likely see an error such as:

<img src="https://user-images.githubusercontent.com/1119017/149858436-c9baa238-a4f7-4c52-b995-0ed8bee97487.png" alt="Authorization Error; Error 401: invalid_client; The OAuth client was not found." width="400"/>

# Getting Started on localhost

* Open *two separate terminal windows*  
* In the first window, start up the backend with:
  ```
  mvn spring-boot:run
  ```
* In the second window:
  ```
  cd frontend
  npm install  # only on first run or when dependencies change
  npm start
  ```

Then, the app should be available on <http://localhost:8080>

If it doesn't work at first, e.g. you have a blank page on  <http://localhost:8080>, give it a minute and a few page refreshes.  Sometimes it takes a moment for everything to settle in.

If you see the following on localhost, make sure that you also have the frontend code running in a separate window.

```
Failed to connect to the frontend server... On Heroku, be sure that PRODUCTION is defined.  On localhost, open a second terminal window, cd into frontend and type: npm install; npm start";
```

# Accessing swagger

To access the swagger API endpoints, use:

* <http://localhost:8080/swagger-ui/index.html>


# To run React Storybook

* cd into frontend
* use: npm run storybook
* This should put the storybook on http://localhost:6006
* Additional stories are added under frontend/src/stories

* For documentation on React Storybook, see: https://storybook.js.org/

# Accessing Database Console

* On localhost only: <http://localhost:8080/h2-console>  See also: [docs/h2-console.md](docs/h2-console.md)
