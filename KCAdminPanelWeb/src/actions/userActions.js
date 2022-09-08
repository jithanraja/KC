
import { AUTH_USER_SUCCESS } from '../stores/types'

export function loginUser(user) {
    return (dispatch) => {
        dispatch({
            type: AUTH_USER_SUCCESS,
            payload: user
        })
    }
}

// export function getAllUser() {
//     return (dispatch) => {
//         dispatch({
//             type: GETALL_USER_FAILED,
//             Error: null
//         })
//         axios.get(`${API_URL}/users/getAllUserlist`)
//             .then(data => {

//                 dispatch({
//                     type: GETALL_USER_SUCCESS,
//                     payload: data
//                 })
//             }).catch(function (err) {
//                 console.log('err', err)
//                 dispatch({
//                     type: GETALL_USER_FAILED,
//                     error: err.response
//                 })
//             })

//     }

// }


