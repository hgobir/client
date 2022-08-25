import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { accountService, alertService } from '@/_services';

function VerifyEmail({ history }) {
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed'
    }

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
        const { token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname);

        accountService.verifyEmail(token)
            .then(response => response.text())
            .then(responseString => {
                if(responseString === 'confirmed') {
                    console.log(`this is text from backend in verify email! ${responseString}`)
                    alertService.success('Verification successful, you can now login.', { keepAfterRouteChange: true });
                    history.push('login');
                } else {
                    alertService.error('Verification unsuccessful, please try again.', { keepAfterRouteChange: false });
                    setEmailStatus(EmailStatus.Failed);
                }
            })
            .catch(() => {
                alertService.error('Verification unsuccessful, please try again.', { keepAfterRouteChange: false });
                setEmailStatus(EmailStatus.Failed);
            });
    }, []);

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <div>Verifying...</div>;
            case EmailStatus.Failed:
                return <div>Verification failed, you can also verify your account using the <Link to="forgot-password">forgot password</Link> page.</div>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Verify Email</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { VerifyEmail };