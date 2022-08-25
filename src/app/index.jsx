import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import { Nav, PrivateRoute, Alert } from '@/_components';
import { Home } from '@/home';
import { Profile } from '@/profile';
import { Admin } from '@/admin';
import { Account } from '@/account';
import {User} from "@/user";
import {UserContext} from "@/_helpers/user.context";

function App() {

    const { pathname } = useLocation();
    const [user, setUser] = useState({});
    const [globalAvailableFunds, setGlobalAvailableFunds] = useState(null);
    const [userRenderedCounter, setUserRenderedCounter] = useState(0);
    // const updateAvailableFundsCounter = () => setAvailableFundsCounter(availableFundsCounter + 1);


    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        // setAvailableFunds(accountService.userValue["availableFunds"])
        return subscription.unsubscribe;
    }, []);



    return (
        <div className={'app-container' + (user && ' bg-light')}>
            <UserContext.Provider value={{globalAvailableFunds, setGlobalAvailableFunds}}>
                <Nav />
                <Alert />
                <Switch>
                    <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                    <PrivateRoute path="/user" roles={[Role.User]} component={User} />
                    <Route path="/account" component={Account} />
                    <Redirect from="*" to="/" />
                </Switch>
            </UserContext.Provider>

        </div>
    );
}

export { App };