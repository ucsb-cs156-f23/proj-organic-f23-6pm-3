import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminUsersPage from "main/pages/AdminUsersPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import usersFixtures from "fixtures/usersFixtures";

describe("AdminUsersPage tests",  () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(()=>{
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/admin/users").reply(200, usersFixtures.threeUsers);

    });

    test("renders without crashing on two users", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText("Users")).toBeInTheDocument();
        const toggleAdmin = screen.getByTestId(`UsersTable-cell-row-0-col-toggle-admin-button`);
        expect(toggleAdmin).toBeInTheDocument();
        expect(toggleAdmin).toHaveClass("btn-primary");
        const toggleInstructor = screen.getByTestId(`UsersTable-cell-row-0-col-toggle-instructor-button`);
        expect(toggleInstructor).toBeInTheDocument();
        expect(toggleInstructor).toHaveClass("btn-primary");
    });
});
