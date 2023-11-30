import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import CourseForm from "main/components/Courses/CourseForm";
import { courseFixtures } from "fixtures/courseFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("CourseForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await screen.findByText(/Name/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Course", async () => {

        render(
            <Router  >
                <CourseForm initialContents={courseFixtures.oneCourse} />
            </Router>
        );
        expect(await screen.findByTestId("CourseForm-id")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-name")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-school")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-term")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-start")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-endDate")).toBeInTheDocument();
        expect(await screen.findByTestId("CourseForm-githubOrg")).toBeInTheDocument();
        expect(screen.getByText(/Create/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await screen.findByTestId("CourseForm-submit");
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/School is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term is required./)).toBeInTheDocument();
        expect(screen.getByText(/StartDate is required./)).toBeInTheDocument();
        expect(screen.getByText(/EndDate is required./)).toBeInTheDocument();
        expect(screen.getByText(/GithubOrganization is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <CourseForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("CourseForm-name");

        const nameField = screen.getByTestId("CourseForm-name");
        const schoolField = screen.getByTestId("CourseForm-school");
        const termField = screen.getByTestId("CourseForm-term");
        const startDateField = screen.getByTestId("CourseForm-start");
        const endDateField = screen.getByTestId("CourseForm-endDate");
        const githubOrganizationField = screen.getByTestId("CourseForm-githubOrg");
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.change(nameField, { target: { value: 'CMPSC 156' } });
        fireEvent.change(schoolField, { target: { value: 'UCSB' } });
        fireEvent.change(termField, { target: { value: 'F23' } });
        fireEvent.change(startDateField, { target: { value: '2022-01-02T12:00:10' } });
        fireEvent.change(endDateField, { target: { value: '2023-01-02T12:00:12' } });
        fireEvent.change(githubOrganizationField, { target: { value: 'ucsb-cs156-f23' } })
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await screen.findByTestId("CourseForm-cancel");
        const cancelButton = screen.getByTestId("CourseForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});