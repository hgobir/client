import React from 'react';
import { Link } from 'react-router-dom';
import {accountService} from "@/_services";

function Landing({ match }) {
    const { path } = match;

    const user = accountService.userValue;


    return (
        <div>
            <h1>User</h1>
            <p>This section can only be accessed by users.</p>
            {
                !user.verified ?
                    <p>account isn't verified so unable to trade! <Link to={`${path}/creditCard`}>Add Credit Card</Link></p>
                    :
                    <p>account has been successfully verified!</p>
            }
        </div>
    );
}

export { Landing };