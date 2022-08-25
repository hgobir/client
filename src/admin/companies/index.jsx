import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CompanyList } from './CompanyList';
import { CompanyAddEdit } from './CompanyAddEdit';

function Companies({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={CompanyList} />
            <Route path={`${path}/add`} component={CompanyAddEdit} />
            <Route path={`${path}/view/:id`} component={CompanyAddEdit} />
        </Switch>
    );
}

export { Companies };