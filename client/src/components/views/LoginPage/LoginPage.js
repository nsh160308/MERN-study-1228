import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';


function LoginPage(props) {
    const dispatch = useDispatch();//react-redux 라이브러리에서 useDispatch를 사용하기 편하게 dispatch라는 이름으로 재정의해서 사용
    /*
    Email, Password를 위한 state생성
    userState(initialState)는 state의 초기상태를 나타냄
    그리고 useState는 react라이브러리에서 가져올 수 있다.
    */
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)//currentTarget, target둘다됨.
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        
        let body = {
            email: Email,
            password: Password
        }
        //dispatch를통해서 action을 전달한다.
        //action은 _actions폴더안에 user_action으로 관리한다.
        //loginUser는 user_action.js의 함수이름이다.
        console.log('<1>dispatch통해 action전달',body);
        dispatch(loginUser(body))
            .then(res => {
                console.log('<7>response', res);
                if(res.payload.loginSuccess) {
                    //props.history.push('/')//페이지 이동처리
                } else {
                    alert('Error');
                }
            })
    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
        {/* 
        기본 로직
        onChange 이벤트로 무엇인가 칠때, state값이 변경되고
        state값이 input태그의 value로 들어온다.
        */}
        <form style={{ display:'flex', flexDirection:'column' }}
            onSubmit={onSubmitHandler}
        >
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler}/>
            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler}/>
            <br/>
            <button>
                Login
            </button>


        </form>
        
        </div>
    )
}

export default LoginPage
