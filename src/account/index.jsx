import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { accountService } from '@/_services';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import logo from "../resources/images/logo.png";


function Account({ history, match }) {
    const { path } = match;

    useEffect(() => {
        // redirect to home if already logged in
        if (accountService.userValue) {
            history.push('/');
        }
    }, []);

    return (
        <div>
            {/*<div className="card" style={{width: "18rem", marginTop: "26px", marginLeft: "800px", textAlign: "center"}}>*/}

            <div className="container">
                <div className="row" style={{textAlign: "center"}}>
                    {/*<div>*/}
                        <img style={{width: "35rem", display: "block", marginLeft: "auto", marginRight: "auto"}} src={logo} alt="Card image cap" />
                    {/*</div>*/}
                </div>
                <div className="row">
                    <div className="col-sm-8 offset-sm-2 mt-5">
                        <div className="card m-3">
                            <Switch>
                                <Route path={`${path}/login`} component={Login} />
                                <Route path={`${path}/register`} component={Register} />
                                <Route path={`${path}/verify-email`} component={VerifyEmail} />
                                <Route path={`${path}/forgot-password`} component={ForgotPassword} />
                                <Route path={`${path}/reset-password`} component={ResetPassword} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export { Account };