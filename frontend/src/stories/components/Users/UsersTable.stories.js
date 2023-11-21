import React from 'react';

import UsersTable from "main/components/Users/UsersTable";
import usersFixtures from 'fixtures/usersFixtures';

export default {
    title: 'components/Users/UsersTable',
    component: UsersTable
};

const Template = (args) => {
    return (
        <UsersTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    users: []
};

export const ThreeUsers = Template.bind({});

ThreeUsers.args = {
    users: usersFixtures.threeUsers,
};

export const ThreeUsersToggle = Template.bind({});

ThreeUsersToggle.args = {
    users: usersFixtures.threeUsers,
    showToggleButtons: true
};