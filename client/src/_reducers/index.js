//여러가지 기능을 하는 reducer를 combineReducers를 이용해서 
//rootReducer에서 하나로 합쳐준다.
import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user,
})

export default rootReducer;