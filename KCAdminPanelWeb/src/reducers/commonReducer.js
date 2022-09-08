import { 
    SHOW_LOADER,
    HIDE_LOADER,  
 } from '../stores/types'

 const initialState = {    
    isLoading: false
};  

export default function commonReducer(state = initialState, action) {

    switch (action.type) {
        case SHOW_LOADER:
            return { ...state, isLoading: true}
        case HIDE_LOADER:
            return { ...state, isLoading: false }
        default:
            return state;
    }

}