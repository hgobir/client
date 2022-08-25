import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { UserList } from './UserList';
import { UserAddEdit } from './UserAddEdit';

function Users({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={UserList} />
            <Route path={`${path}/add`} component={UserAddEdit} />
            <Route path={`${path}/edit/:id`} component={UserAddEdit} />
        </Switch>
    );
}

export { Users };