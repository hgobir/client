import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;
    const {title, firstName, lastName, username, email, role, verified} = user;

    return (
        <div>
            <h1>My Account Details</h1>
            <p>
                <strong>Name: </strong> {user.title} {user.firstName} {user.lastName}<br />
                <strong>Username: </strong> {user.username}<br />
                <strong>Email: </strong> {user.email}<br/>
                <strong>Role: </strong> {user.role}<br />
                <strong>Account Verified: </strong> {user.verified.toString()}<br />
            </p>
            <p><Link to={`${path}/update`}>Update Account Details</Link></p>
        </div>
    );
}

export { Details };