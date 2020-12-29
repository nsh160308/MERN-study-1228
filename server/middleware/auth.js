const { User } = require('../models/User')

let auth = (req, res, next) => {

    //이 안에서 인증 처리를 할 것이다.


    //인증 순서

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //이 토큰을 복호화 한 뒤, 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        console.log('<1>');
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true });

        //유저가 있으면 인증 처리 완료
        //request에다가 token과 user를 넣어주는 이유는
        //request를 받을 때 넣어줌으로 인해서
        //Route의 callback에서 user와 token을 기져서 사용할 수 있기 때문이다.
        req.token = token;
        req.user = user;
        next(); //next()하는 이유는 미들웨어에서 다음으로 갈 수 있게 해주는 것이다.
    })

}





module.exports = { auth };

