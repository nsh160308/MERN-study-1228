import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            console.log('<4>type', action.type);
            console.log('<5>{...state}', {...state});
            return {...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return {...state, register: action.paylaod }
            break;
        case AUTH_USER:
            return {...state, userData: action.payload }
            break;
        default:
            console.log('default', action.type);
            return state;
            break;
    }

}