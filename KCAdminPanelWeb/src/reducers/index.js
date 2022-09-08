import { combineReducers } from 'redux';

import commonReducer from './commonReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
    userReducer: userReducer,
    commonReducer: commonReducer
});

export default reducers;
