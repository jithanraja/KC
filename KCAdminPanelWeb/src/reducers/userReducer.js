import { 
    AUTH_USER_SUCCESS,
    AUTH_USER_FAILED,  
 } from '../stores/types'

 const initialState = {    
    user: {}
};  

export default function userReducer(state = initialState, action) {

    switch (action.type) {
        case AUTH_USER_SUCCESS:
            return { ...state, user: action.payload}
        case AUTH_USER_FAILED:
            return { ...state, error: action.error }
        default:
            return state;
    }

}