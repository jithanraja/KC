import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from '../reducers';

const middleware = applyMiddleware(reduxThunk);

const store = createStore(reducers, middleware);

export default store;
