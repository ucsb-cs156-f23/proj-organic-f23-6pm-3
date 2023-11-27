import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminCoursesPage from "main/pages/AdminCoursesPage"
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import pagedCourseFixture from "fixtures/pagedCoursesFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminCoursesPage tests", () => {
  let queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/courses/all/pageable").reply(200, pagedCourseFixture.oneCourse);

    // see: https://ucsb-cs156.github.io/topics/testing/testing_jest.html#hiding-the-wall-of-red
    jest.spyOn(console, 'error')
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
     // see: https://ucsb-cs156.github.io/topics/testing/testing_jest.html#hiding-the-wall-of-red
    console.error.mockRestore()
  })


  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCoursesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText("Launch Courses")).toBeInTheDocument();
    expect(await screen.findByText("Course Status")).toBeInTheDocument();

    expect(await screen.findByText("Test Course")).toBeInTheDocument();

  });

  test("user can submit a test course", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCoursesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Test Course")).toBeInTheDocument();

    const testCourseButton = screen.getByText("Test Course");
    expect(testCourseButton).toBeInTheDocument();
    testCourseButton.click();

    expect(await screen.findByTestId("TestCourseForm-fail")).toBeInTheDocument();

    const sleepMsInput = screen.getByTestId("TestCourseForm-sleepMs");
    const submitButton = screen.getByTestId("TestCourseForm-Submit-Button");

    expect(sleepMsInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(sleepMsInput, { target: { value: "0" } });
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/courses/launch/testcourse?fail=false&sleepMs=0"
    );

    expect(mockToast).toHaveBeenCalledWith("Submitted course: Test Course");
  });
});