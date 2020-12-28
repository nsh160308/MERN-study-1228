import {
    LOGIN_USER
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            console.log('<4>type', action.type);
            console.log('<5>{...state}', {...state});
            return {...state, loginSuccess: action.payload }
            break;
    
        default:
            console.log('default', action.type);
            return state;
    }




}