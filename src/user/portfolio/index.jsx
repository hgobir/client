import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {PortfolioList} from "@/user/portfolio/PortfolioList";
import {PortfolioView} from "@/user/portfolio/PortfolioView";

function Portfolio({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={PortfolioList} />
            <Route path={`${path}/view/:id`} component={PortfolioView} />
            {/*<Route path={`${path}/:type/:id`} component={StockBuySell} />*/}
            {/*<Route path={`${path}/sell/:id`} component={StockBuySell} />*/}


            {/*<Route path={`${path}/add`} component={UserAddEdit} />*/}
            {/*<Route path={`${path}/edit/:id`} component={UserAddEdit} />*/}
        </Switch>
    );
}

export { Portfolio };