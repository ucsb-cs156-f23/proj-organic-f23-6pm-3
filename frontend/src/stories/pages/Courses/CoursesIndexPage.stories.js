import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { courseFixtures } from 'fixtures/courseFixtures';
import { rest } from "msw";

import CoursesIndexPage from 'main/pages/Courses/CoursesIndexPage';

export default {
    title: 'pages/Courses/CoursesIndexPage',
    component: CoursesIndexPage
};

const Template = () => <CoursesIndexPage storybook={true}/>;

export const EmptyAdminUser = Template.bind({});

EmptyAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(courseFixtures.threeCourses));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}

export const ThreeItemsInstructorUser = Template.bind({});

ThreeItemsInstructorUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.instructorUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(courseFixtures.threeCourses));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(courseFixtures.threeCourses));
        }),
    ],
}