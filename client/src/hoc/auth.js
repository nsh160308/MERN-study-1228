import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    //option
    //1.null => 아무나 출입이 가능한 페이지
    //2.true => 로그인한 유저만 출입이 가능한 페이지
    //3.false => 로그인 한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);

                //여기서 분기처리한다.
                //1.로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {//2.로그인하지 않은상태에서 로그인한 유저만 출입가능한 페이지로 가려고할때
                        props.history.push('/login');
                    }
                } else {
                    //3.로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        //어드민유저만 들어올 수 있는데 
                        //어드민 권한이 없는 사람이 들어오려고할때
                        props.history.push('/');
                    } else {
                        //
                        if(option === false)
                        props.history.push('/');
                    }
                }
            })
            
        }, [])

        return (
            <SpecificComponent {...props}/>
        )
    }
    return AuthenticationCheck
}