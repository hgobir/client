import React from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';
import {Home} from "@/home";
import {PrivateRoute} from "@/_components";
import {Profile} from "@/profile";
import {Landing} from "@/user/Landing";
import {CreditCard} from "./creditCard";
import {accountService} from "@/_services";
import {Stock} from "@/user/stocks";
import {Order} from "@/user/orders";
import { Portfolio } from "@/user/portfolio";
import { Transaction } from "@/user/transactions";
import { Reports } from "@/user/reports";


function User({ match, history }) {
    const { path } = match;

    const user = accountService.userValue;


    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Landing} />
                    <Route path={`${path}/creditCard`} component={CreditCard} />
                    <Route path={`${path}/stocks`} component={Stock} />
                    <Route path={`${path}/transactions`} component={Transaction} />
                    <Route path={`${path}/reports`} component={Reports} />
                    <Route path={`${path}/orders`} component={Order} />
                    <Route path={`${path}/portfolio`} component={Portfolio} />
                </Switch>
            </div>
        </div>
    );
}

export { User };