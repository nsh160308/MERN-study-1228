import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();//react-redux 라이브러리에서 useDispatch를 사용하기 편하게 dispatch라는 이름으로 재정의해서 사용
    
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)//currentTarget, target둘다됨.
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(Password !== ConfirmPassword) {
            return alert("비밀번호가 맞지 않습니다.");
        }
        let body = {
            email: Email,
            name: Name,
            password: Password
        }
        //dispatch를통해서 action을 전달한다.
        //action은 _actions폴더안에 user_action으로 관리한다.
        //loginUser는 user_action.js의 함수이름이다.
        console.log('<1>dispatch통해 action전달',body);
        dispatch(registerUser(body))
            .then(res => {
                if(res.payload.success) {
                    props.history.push("/login")
                    alert('가입성공');
                } else {
                    alert('Failed to sign Up');
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
            <label>Name</label>
            <input type="text" value={Name} onChange={onNameHandler}/>
            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler}/>
            <label>Comfirm Password</label>
            <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
            
            <br/>
            <button>
                Sign Up
            </button>


        </form>
        
        </div>
    )
}

export default RegisterPage
