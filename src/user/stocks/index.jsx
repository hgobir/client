import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {StockList} from "@/user/stocks/StockList";
import {StockView} from "@/user/stocks/StockView";
import {StockBuySell} from "@/user/stocks/StockBuySell";

function Stock({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={StockList} />
            <Route path={`${path}/view/:id`} component={StockView} />
            <Route path={`${path}/:type/:id`} component={StockBuySell} />
            {/*<Route path={`${path}/sell/:id`} component={StockBuySell} />*/}


            {/*<Route path={`${path}/add`} component={UserAddEdit} />*/}
            {/*<Route path={`${path}/edit/:id`} component={UserAddEdit} />*/}
        </Switch>
    );
}

export { Stock };