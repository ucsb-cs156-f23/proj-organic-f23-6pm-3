import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CoursesCreatePage from "main/pages/CoursesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CoursesCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /courses", async () => {

        const queryClient = new QueryClient();
        const course = {
            "id": 1,
            "name": "CMPSC 156",
            "school": "UCSB",
            "term": "F23",
            "startDate": "2023-09-27T14:00",
            "endDate": "2023-12-12T15:15",
            "githubOrg": "ucsb-cs156-f23"
        };

        axiosMock.onPost("/api/courses/post").reply(202, course);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const schoolInput = screen.getByLabelText("School");
        expect(schoolInput).toBeInTheDocument();

        const termInput = screen.getByLabelText("Term");
        expect(termInput).toBeInTheDocument();

        const startInput = screen.getByLabelText("Start Date (iso format)");
        expect(startInput).toBeInTheDocument();

        const endInput = screen.getByLabelText("End Date (iso format)");
        expect(endInput).toBeInTheDocument();

        const githubOrgInput = screen.getByLabelText("Github Organization");
        expect(githubOrgInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'CMPSC 156' } })
        fireEvent.change(schoolInput, { target: { value: 'UCSB' } })
        fireEvent.change(termInput, { target: { value: 'F23' } })
        fireEvent.change(startInput, { target: { value: '2023-09-27T14:00:00' } })
        fireEvent.change(endInput, { target: { value: '2023-12-12T15:15:00' } })
        fireEvent.change(githubOrgInput, { target: { value: 'ucsb-cs156-f23' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "name": "CMPSC 156",
            "school": "UCSB",
            "term": "F23",
            "startDate": "2023-09-27T14:00",
            "endDate": "2023-12-12T15:15",
            "githubOrg": "ucsb-cs156-f23"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New Course Created - id: 1 name: CMPSC 156");
        expect(mockNavigate).toBeCalledWith({ "to": "/courses/" });

    });
});

