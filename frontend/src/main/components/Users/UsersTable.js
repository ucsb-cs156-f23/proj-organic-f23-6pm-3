import React from "react";
import OurTable, {ButtonColumn} from "main/components/OurTable"
import { useBackendMutation } from "main/utils/useBackend";
import { formatTime } from "main/utils/dateUtils";
import { cellToAxiosParamsToggleAdmin, cellToAxiosParamsToggleInstructor, toggleAdminSuccess, toggleInstructorSuccess } from "../Utils/UsersTableUtils";

const columns = [
    {
        Header: 'githubId',
        accessor: 'githubId', // accessor is the "key" in the data
    },
    {
        Header: 'githubLogin',
        accessor: 'githubLogin', // accessor is the "key" in the data
    },
    {
        Header: 'fullName',
        accessor: 'fullName',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Last Online',
        id: 'lastOnline',
        accessor: (row) => formatTime(row.lastOnline),
    },
    {
        Header: 'Admin',
        id: 'admin',
        accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
    },
    {
        Header: 'Instructor',
        id: 'instructor',
        accessor: (row, _rowIndex) => String(row.instructor) // hack needed for boolean values to show up
    }
];

export default function UsersTable({ users, showToggleButtons }) {

    // toggle admin
    // Stryker disable all : hard to test for query caching
    const toggleAdminMutation = useBackendMutation(
        cellToAxiosParamsToggleAdmin,
        { onSuccess: toggleAdminSuccess},
        ["/api/admin/users/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleAdminCallback = async (cell) => {toggleAdminMutation.mutate(cell);}

    // toggle instructor
    // Stryker disable all : hard to test for query caching
    const toggleInstructorMutation = useBackendMutation(
        cellToAxiosParamsToggleInstructor,
        {onSuccess: toggleInstructorSuccess},
        ["/api/admin/users/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleInstructorCallback = async (cell) => {toggleInstructorMutation.mutate(cell);}

    const buttonColumns = [
        ...columns,
        ButtonColumn("toggle-admin", "primary", toggleAdminCallback, "UsersTable"),
        ButtonColumn("toggle-instructor", "primary", toggleInstructorCallback, "UsersTable")
    ]

    const retColumns = showToggleButtons ? buttonColumns : columns;

    return <OurTable
        columns={retColumns}
        data={users}
        testid={"UsersTable"} />;
};
