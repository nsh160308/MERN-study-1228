import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
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

export function registerUser(dataToSubmit) {
    console.log('<2>action 전달 받음', dataToSubmit);
    const request = axios.post('/api/users/register', dataToSubmit)//node서버로 보낸다
    .then(res => res.data);
    console.log('<3>변수 request 결과',request);//프로미스형태가 반환됐다.

    //위의 request를 reducer에 전달해줘야된다.
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get('/api/users/auth')//node서버로 보낸다
    .then(res => res.data);
    console.log('<3>변수 request 결과',request);//프로미스형태가 반환됐다.

    //위의 request를 reducer에 전달해줘야된다.
    return {
        type: AUTH_USER,
        payload: request
    }
}