import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {TransactionList} from "@/user/transactions/TransactionList";
import {TransactionHistory} from "@/user/transactions/TransactionHistory";

function Transaction({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={TransactionList} />
            <Route path={`${path}/view/:id`} component={TransactionHistory} />
            {/*<Route path={`${path}/:type/:id`} component={StockBuySell} />*/}
            {/*<Route path={`${path}/sell/:id`} component={StockBuySell} />*/}


            {/*<Route path={`${path}/add`} component={UserAddEdit} />*/}
            {/*<Route path={`${path}/edit/:id`} component={UserAddEdit} />*/}
        </Switch>
    );
}

export { Transaction };