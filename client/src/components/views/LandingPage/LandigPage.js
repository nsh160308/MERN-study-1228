import React, { useEffect } from 'react'
import axios from 'axios';

function LandigPage() {
    /*
    이렇게 axios를 이용해서 server로 보내도 보내지지 않는다.
    왜냐면 server는 5000포트를 사용하고 있는데 client는 3000포트로
    사용하고 있기때문에 /api/hello는 3000포트로 가고있다.
    그렇다고해서 http://localhost:5000/으로 하면 
    CORS정책에 의해 차단됐다는 오류메세지와 함께 동작하지 않는다. 
    이는 서로다른 포트를 사용하고있는데 어떠한 설정없이 
    다른포트로 전송하려 할때 CORS정책에 의해 막히게 된다.
    CORS정책이 왜 존재하냐면 만약, 다른 사이트에서 다른 포트로
    우리 사이트에 무엇인가 보내거나 테러할 수 있는 
    위험성이 존재하기 때문에 CORS정책이 있는 것이다.

    CORS(Cross-Origin Resource Sharing)정책을 해결하기 위해서는
    Proxy라는 것을 사용해서 해결할 수 있다.
    */
    useEffect(() => {
    axios.get('/api/hello')
        .then(response => { console.log(response) })
    }, [])

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
        </div>
    )
}

export default LandigPage
