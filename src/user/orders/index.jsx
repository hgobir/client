import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {OrderList} from "@/user/orders/OrderList";


function Order({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={OrderList} />
            {/*<Route path={`${path}/edit/:id`} component={UserAddEdit} />*/}
        </Switch>
    );
}

export { Order };