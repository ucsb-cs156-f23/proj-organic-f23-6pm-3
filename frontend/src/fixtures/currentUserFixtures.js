const apiCurrentUserFixtures = {
    adminUser: {
        "user":
        {
            "githubId": 1119017,
            "githubNodeId": "MDQ6VXNlcjExMTkwMTc=",
            "githubLogin": "pconrad",
            "email": "pconrad@cs.ucsb.edu",
            "pictureUrl": "https://avatars.githubusercontent.com/u/1119017?v=4",
            "fullName": "Phill Conrad",
            "emailVerified": true,
            "admin": true,
            "instructor": false,
            "accessToken": "ghu_Du4W9ThisIsNotARealTokenXyzska1w9SuT",
            "emails": [{
                "email": "pconrad@cs.ucsb.edu",
                "githubId": 1119017
            },
            {
                "email": "pconrad.cis@gmail.com",
                "githubId": 1119017
            },
            {
                "email": "pconrad@engineering.ucsb.edu",
                "githubId": 1119017
            },
            {
                "email": "pconrad@engr.ucsb.edu",
                "githubId": 1119017
            }],
            "lastOnline": "2023-11-09T21:06:11.131913Z"
        },
        "roles": [
            { "authority": "SCOPE_email" },
            {
                "authority": "ROLE_USER",
                "attributes": {
                    "login": "pconrad",
                    "id": 1119017,
                    "node_id": "MDQ6VXNlcjExMTkwMTc=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/1119017?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/pconrad",
                    "html_url": "https://github.com/pconrad",
                    "followers_url": "https://api.github.com/users/pconrad/followers",
                    "following_url": "https://api.github.com/users/pconrad/following{/other_user}",
                    "gists_url": "https://api.github.com/users/pconrad/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/pconrad/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/pconrad/subscriptions",
                    "organizations_url": "https://api.github.com/users/pconrad/orgs",
                    "repos_url": "https://api.github.com/users/pconrad/repos",
                    "events_url": "https://api.github.com/users/pconrad/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/pconrad/received_events",
                    "type": "User",
                    "site_admin": false,
                    "name": "Phill Conrad",
                    "company": "UC Santa Barbara",
                    "blog": "http://www.cs.ucsb.edu/~pconrad",
                    "location": "Santa Barbara, CA",
                    "email": null,
                    "hireable": null,
                    "bio": null,
                    "twitter_username": null,
                    "public_repos": 267,
                    "public_gists": 1,
                    "followers": 81,
                    "following": 12,
                    "created_at": "2011-10-11T09:33:28Z",
                    "updated_at": "2023-11-08T20:14:48Z"
                }
            },
            { "authority": "ROLE_ADMIN" },
            { "authority": "SCOPE_profile" }]
    },
    instructorUser: {
        "user":
        {
            "githubId": 1119017,
            "githubNodeId": "MDQ6VXNlcjExMTkwMTc=",
            "githubLogin": "pconrad",
            "email": "pconrad@cs.ucsb.edu",
            "pictureUrl": "https://avatars.githubusercontent.com/u/1119017?v=4",
            "fullName": "Phill Conrad",
            "emailVerified": true,
            "admin": false,
            "instructor": true,
            "accessToken": "ghu_Du4W9ThisIsNotARealTokenXyzska1w9SuT",
            "emails": [{
                "email": "pconrad@cs.ucsb.edu",
                "githubId": 1119017
            },
            {
                "email": "pconrad.cis@gmail.com",
                "githubId": 1119017
            },
            {
                "email": "pconrad@engineering.ucsb.edu",
                "githubId": 1119017
            },
            {
                "email": "pconrad@engr.ucsb.edu",
                "githubId": 1119017
            }],
            "lastOnline": "2023-11-09T21:06:11.131913Z"
        },
        "roles": [
            { "authority": "SCOPE_email" },
            {
                "authority": "ROLE_USER",
                "attributes": {
                    "login": "pconrad",
                    "id": 1119017,
                    "node_id": "MDQ6VXNlcjExMTkwMTc=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/1119017?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/pconrad",
                    "html_url": "https://github.com/pconrad",
                    "followers_url": "https://api.github.com/users/pconrad/followers",
                    "following_url": "https://api.github.com/users/pconrad/following{/other_user}",
                    "gists_url": "https://api.github.com/users/pconrad/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/pconrad/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/pconrad/subscriptions",
                    "organizations_url": "https://api.github.com/users/pconrad/orgs",
                    "repos_url": "https://api.github.com/users/pconrad/repos",
                    "events_url": "https://api.github.com/users/pconrad/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/pconrad/received_events",
                    "type": "User",
                    "site_admin": false,
                    "name": "Phill Conrad",
                    "company": "UC Santa Barbara",
                    "blog": "http://www.cs.ucsb.edu/~pconrad",
                    "location": "Santa Barbara, CA",
                    "email": null,
                    "hireable": null,
                    "bio": null,
                    "twitter_username": null,
                    "public_repos": 267,
                    "public_gists": 1,
                    "followers": 81,
                    "following": 12,
                    "created_at": "2011-10-11T09:33:28Z",
                    "updated_at": "2023-11-08T20:14:48Z"
                }
            },
            { "authority": "ROLE_INSTRUCTOR" },
            { "authority": "SCOPE_profile" }]
    },
    userOnly: {
        "user":
        {
            "githubId": 1119018,
            "githubNodeId": "MDQ6VXNlcjExMTkwMTc=",
            "githubLogin": "cgaucho",
            "email": "cgaucho@cs.ucsb.edu",
            "pictureUrl": "https://avatars.githubusercontent.com/u/1119017?v=4",
            "fullName": "Chris Gaucho",
            "emailVerified": true,
            "admin": false,
            "instructor": false,
            "accessToken": "ghu_Du4W9ThisIsNotARealTokenEither1w9SuT",
            "emails": [{
                "email": "cgaucho@cs.ucsb.edu",
                "githubId": 1119018
            },
            ],
            "lastOnline": "2023-11-09T21:06:11.131913Z"
        },
        "roles": [
            { "authority": "SCOPE_email" },
            {
                "authority": "ROLE_USER",
                "attributes": {
                    "login": "cgaucho",
                    "id": 1119018,
                    "node_id": "MDQ6VXNlcjExMTkwMTc=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/1119017?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/cgaucho",
                    "html_url": "https://github.com/cgaucho",
                    "followers_url": "https://api.github.com/users/cgaucho/followers",
                    "following_url": "https://api.github.com/users/cgaucho/following{/other_user}",
                    "gists_url": "https://api.github.com/users/cgaucho/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/cgaucho/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/cgaucho/subscriptions",
                    "organizations_url": "https://api.github.com/users/cgaucho/orgs",
                    "repos_url": "https://api.github.com/users/cgaucho/repos",
                    "events_url": "https://api.github.com/users/cgaucho/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/cgaucho/received_events",
                    "type": "User",
                    "site_admin": false,
                    "name": "Chris Gaucho",
                    "company": "UC Santa Barbara",
                    "blog": "http://www.cs.ucsb.edu/~cgaucho",
                    "location": "Santa Barbara, CA",
                    "email": null,
                    "hireable": null,
                    "bio": null,
                    "twitter_username": null,
                    "public_repos": 267,
                    "public_gists": 1,
                    "followers": 81,
                    "following": 12,
                    "created_at": "2011-10-11T09:33:28Z",
                    "updated_at": "2023-11-08T20:14:48Z"
                }
            },
            { "authority": "SCOPE_profile" }]



    },
};

const currentUserFixtures = {
    adminUser: {
        loggedIn: true,
        root: {
            ...(apiCurrentUserFixtures.adminUser),
            rolesList: [
                "ROLE_USER",
                "ROLE_ADMIN"
            ]
        },
    },
    instructorUser: {
        loggedIn: true,
        root: {
            ...(apiCurrentUserFixtures.instructorUser),
            rolesList: [
                "ROLE_USER",
                "ROLE_INSTRUCTOR"
            ]
        }
    },
    userOnly: {
        loggedIn: true,
        root: {
            ...(apiCurrentUserFixtures.userOnly),
            rolesList: [
                "SCOPE_email",
                "ROLE_USER",
                "SCOPE_profile",
            ]
        },
    },
    noRoot: {
        loggedIn: true,
    },
    not_logged_in: {
        loggedIn: false,
    }
};

export {
    currentUserFixtures,
    apiCurrentUserFixtures
};