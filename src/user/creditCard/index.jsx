import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {CreditCardAdd} from "./creditCardAdd";

function CreditCard({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={CreditCardAdd} />
            {/*<Route path={`${path}/add`} component={UserAddEdit} />*/}
            {/*<Route path={`${path}/edit/:id`} component={UserAddEdit} />*/}
        </Switch>
    );
}

export { CreditCard };