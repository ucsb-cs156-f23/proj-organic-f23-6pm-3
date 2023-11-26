import React from 'react';
import CoursesTable from "main/components/Courses/CoursesTable";
import { courseFixtures } from 'fixtures/courseFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Courses/CoursesTable',
    component: CoursesTable
};

const Template = (args) => {
    return (
        <CoursesTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    courses: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    courses: courseFixtures.threeCourses,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    courses: courseFixtures.threeCourses,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};