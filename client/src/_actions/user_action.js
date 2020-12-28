import axios from 'axios';
import {
    LOGIN_USER,

} from './types';

export function loginUser(dataToSubmit) {
    console.log('<2>action 전달 받음', dataToSubmit);
    const request = axios.post('/api/users/login', dataToSubmit)//node서버로 보낸다
    .then(res => res.data);
    console.log('<3>변수 request 결과',request);//프로미스형태가 반환됐다.

    //위의 request를 reducer에 전달해줘야된다.
    return {
        type: LOGIN_USER,
        payload: request
    }
}
