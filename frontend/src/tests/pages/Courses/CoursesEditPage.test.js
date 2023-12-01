import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import CoursesEditPage from "main/pages/Courses/CoursesEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("CoursesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/courses", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Course");
            expect(screen.queryByTestId("CourseForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/courses", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "CMPSC 156",
                school: "UCSB",
                term: "F23",
                startDate: "2023-09-27T14:00",
                endDate: "2023-12-12T15:15",
                githubOrg: "ucsb-cs156-f23"
            });
            axiosMock.onPut('/api/courses/update').reply(200, {
                id: "17",
                name: "CMPSC 111",
                school: "UCLA",
                term: "W24",
                startDate: "2024-01-01T09:00",
                endDate: "2024-03-15T10:15",
                githubOrg: "ucla-cs111-w24"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CourseForm-name");

            const idField = screen.getByTestId("CourseForm-id");
            const nameField = screen.getByTestId("CourseForm-name");
            const schoolField = screen.getByTestId("CourseForm-school");
            const termField = screen.getByTestId("CourseForm-term");
            const startField = screen.getByTestId("CourseForm-start");
            const endField = screen.getByTestId("CourseForm-end");
            const githubOrgField = screen.getByTestId("CourseForm-githubOrg");
            const submitButton = screen.getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CMPSC 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("F23");
            expect(startField).toHaveValue("2023-09-27T14:00");
            expect(endField).toHaveValue("2023-12-12T15:15");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CourseForm-name");

            const idField = screen.getByTestId("CourseForm-id");
            const nameField = screen.getByTestId("CourseForm-name");
            const schoolField = screen.getByTestId("CourseForm-school");
            const termField = screen.getByTestId("CourseForm-term");
            const startField = screen.getByTestId("CourseForm-startDate");
            const endField = screen.getByTestId("CourseForm-endDate");
            const githubOrgField = screen.getByTestId("CourseForm-githubOrg");
            const submitButton = screen.getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CMPSC 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("F23");
            expect(startField).toHaveValue("2023-09-27T14:00");
            expect(endField).toHaveValue("2023-12-12T15:15");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'CMPSC 111' } })
            fireEvent.change(schoolField, { target: { value: 'UCLA' } })
            fireEvent.change(termField, { target: { value: 'W24' } })
            fireEvent.change(startField, { target: { value: '2024-01-01T09:00' } })
            fireEvent.change(endField, { target: { value: '2024-03-15T10:15' } })
            fireEvent.change(githubOrgField, { target: { value: 'ucla-cs111-w24' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toBeCalledWith("Course Updated - id: 17 githubOrg: ucla-cs111-w24");
            expect(mockNavigate).toBeCalledWith({ "to": "/courses" });

            expect(nameField).toHaveValue("CMPSC 111");

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ courseId: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "CMPSC 111",
                school: "UCLA",
                term: "W24",
                startDate: "2024-01-01T09:00",
                endDate: "2024-03-15T10:15",
                githubOrg: "ucla-cs111-w24"
            })); // posted object

        });


    });

});