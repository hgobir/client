import React from 'react';

import { accountService } from '@/_services';
import logo from "../resources/images/logo.png";


function Home() {
    const user = accountService.userValue;

    return (
        <div className="p-4">
            <div className="container">
                <div className="jumbotron" style={{textAlign: "center"}} >
                    <h1 className="display-4">Hi {user.username}!</h1>
                    <br />
                    <p className="lead">Welcome to alphatrader! The professional stock and shares trading platform for traders of all backgrounds! if verified please select stocks to view current shares in circulation</p>
                    <br />
                    <hr className="my-4" />

                    {/*<div style={{ width: "18rem", marginTop: "26px", textAlign: "center"}}>*/}
                        <img style={{ width: "18rem"}} src={logo} alt="Card image cap" />
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export { Home };