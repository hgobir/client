import React, {useState} from 'react';
import {Route, Switch} from "react-router-dom";
import {ReportView} from "@/user/reports/ReportView";
import {ReportDownload} from "@/user/reports/ReportDownload";

function Reports({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={ReportView} />
            <Route path={`${path}/download/:format/:id`} component={ReportDownload} />

        </Switch>
    );
}

export { Reports };