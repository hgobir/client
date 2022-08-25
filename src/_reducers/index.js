import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { user } from './user.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
    user,
    alert,
    authentication,
    registration
});

export default rootReducer;