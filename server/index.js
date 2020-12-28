const express = require('express')//express모듈을 가져온다.
const app = express();//가져온 express의 function을 이용해서 새로운 app을 만든다.
const port = 5000//port번호를 정한다.
const bodyParser = require('body-parser');//body-parser모듈 가져오기
const cookieParser = require('cookie-parser');//cookie-parser모듈 가져오기
const config = require('./config/key');
const { User } = require('./models/User');//모델 가져오기
const { auth } = require('./middleware/auth');//인증 가져오기

//bodyParser옵션 주기
//application/x-www-form-urlencoded로 되어있는 데이터를 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.urlencoded({extended: true}));

//application/json로 되어있는 데이터를 분석해서 가져올 수 있도록 해주는 코드
app.use(bodyParser.json());
//app.use()로 cookieParser 라이브러리 사용
app.use(cookieParser());




//mongoDB 연결
const mongoose = require('mongoose');//mongoose모듈 가져온다.
//mongoDB계정 정보를 보호하려고 따로 폴더를 뺐으면 이 안에 들어가야되는 것은
//그 폴더를 사용할 수 있게 require하고 그것을 첫번째 인자로준다.
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err))

//root 디렉토리에 send()메세지를 보낸다.
//이런 것들이 Route라고 하는 거 같다.
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요^^. 새해복 많이 받으세요 nodemon이 동작되나요?')
})

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요 axios~')
})


//회원가입을 위한 Register Route 생성
app.post('/api/users/register', (req, res) => {
    //회원가입할 때 필요한 정보들을 클라이언트에서 가져 오면
    //그 정보들을 데이터 베이스에 CREATE한다.
    //우리가 만든 User모델을 가져와야된다.

    //가져온 모델을 이용해서 인스턴스(객체)를 만든다.
    //인스턴스를 생성할 때, 클라이언트에서 받은 정보들을
    //데이터베이스에 주입하고 싶을때는 req.body(@RequestBody)로 해주면된다.
    //req.body안에는 json형식으로 정보가 들어있다.
    //이렇게 해주는 것은 body-parser가 
    //클라이언트에서 받은 정보를 분석해서 전달하기때문에 가능하다.
    const user = new User(req.body);

    //밑에서 save()를 하기전에 암호화를 시켜준다.
    //mongoose의 기능을 이용해야되는데 User.js(User모델)에서 진행한다.

    //save()는 mongoDB에서 오는 메소드이다.
    //이렇게 해주면 req.body의 정보들이 DB에 저장이되고
    //그 후에 callback함수가 오게 되는데
    user.save((err, userInfo) => {
        //만약에 저장을 할때, err가 발생한다면 
        //클라이언트에게 에러가 있다고 전달해줘야 된다.
        //그런데, 전달을 할때, json형식으로 전달하면 된다.
        //success: false로 성공하지 못했다고 전달하고,
        //err메세지까지 같이 전달해준다.
        if(err) return res.json({ success: false, err})
        //저장하는데 성공했으면 저장한 userInfo를 클라이언트에다가
        //json형식으로 전달해주면된다.
        return res.status(200).json({
            //res.status(200)은 성공했다는 표시
            success: true
        })
    })
})

//로그인을 위한 Route생성
app.post('/api/users/login', (req, res) => {
    console.log('[1]로그인 시도 - ', req.body);
    //첫번째 일.요청된 이메일을 DB에서 찾아야되겠죠?
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log("[2]err", err);
        console.log("[3]user", user);
        //만약에 요청한 이메일이(req.body.email) User안에 한명도 없다면
        //이 user가없겠죠?
        if(!user) {
            console.log('[3-1]에러 발생');
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        console.log("[3-2]요청된 이메일이 있습니다.");
        //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인해야죠?
        //이 user에는 이메일뿐만아니라 사용자가 입력한 모든정보가 들어있겠죠?
        //그렇다면 비밀번호도 있다는 뜻이겠죠?
        //첫번째인자로는 사용자가 넘겨준 비밀번호고,
        //두번째인자는 콜백함수를 전달하는데
        //콜백함수의 첫번째 인자는 err메세지고
        //두번째인자는 사용자가 입력한 비밀번호와 DB에저장된 비밀번호를 비교해서
        //그게 맞다면 두번째 인자에 넣을것이기 때문에 이름은 isMatch로 한다.
        //그리고 이 comparePassword()메소드를 User모델을 관리하는 User.js에서 만들면된다.
        console.log("[4]비밀번호 확인 요청");
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)//비밀번호가 틀렸다는것
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            //비밀번호까지 맞다면 그 유저에 맞는 토큰을 생성해야겠죠?
            //이것도 똑같이 메소드를 User모델을 관리하는 User.js에서 만들어주면된다.
            console.log('[8]비밀번호가 일치합니다.');
            console.log('[9]토큰을 생성합니다.');
            user.generateToken((err, user) => {
                console.log('[16]전달된 결과를 확인합니다.');
                console.log('[16-1] err', err);
                console.log('[16-2] user',user);
                if(err) return res.status(400).send(err);

                //에러가 없다면 user정보를 가져오는데
                //여기에 지금 token이 생성돼서 들어가있다.
                //얘를 어디다가 저장해서 보관을 해야되는데 어디다가 하지?
                //쿠키에다가 할 수 있고, local storage에 저장할 수 있는데
                //여기서는 쿠키에다가 하겠다.
                //쿠키에다가 토큰을 저장하려면 cookie-parser라는 라이브러리를 설치해줘야된다.
                console.log('[17]에러가 없습니다. 토큰을 쿠키에 저장합니다.');
                res.cookie("x_auth",user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            })
        })
    })
})


// role 0 -> 일반유저 role !0 -> 관리자


//Authentication(인증) Route생성
//여기에서는 auth라는 미들웨어를 추가할 것이다.
//미들웨어란 엔드포인트에 request를 받은 다음에
//callback하기전에 중간에서 무엇을 해주는 것이다.
app.get('/api/users/auth', auth, (req, res) => {
    //결론적으로 여기까지 도달했다는 것은 auth라는 미들웨어에서
    //인증처리를 진행했고 인증이 완료돼서 이곳으로 넘어왔다는 것이다.
    //이제 인증이 완료됐다고 클라이언트에 정보를 전달해주면 된다.
    res.status(200).json({
        //유저 정보들을 전달해주면 되는데 User모델에 정의한 것들이다.
        //굳이 다 전달할 필요없고 원하는것만 전달하면된다.
        //이렇게 할 수 있는 이유는 auth미들웨어에서 request로 user정보를
        //넘겨줬기 떄문이다.
        _id: req.user_id,
        isAdmin: req.user.role === 0 ? false : true, //여기는 바꿀수 있다.
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

//로그아웃 Route생성
//로그아웃 하려는 유저를 데이터베이스에 찾아서
//그 데이터베이스 유저의 토큰을 지워주면된다.
//왜 토큰을 지워주면 되냐면
//auth Route에서 인증을 할때
//클라이언트 쿠키에 들어있는 토큰을 가져와서
//db에 있는 토큰과 같은지 확인하면서 인증을 시켰는데
//이 토큰이 db에 없으면은 인증이 맞지 않기 때문에 인증이 안되고
//로그아웃할 때 토큰을 지워주게 되면 로그인 기능이 풀려버린다.

//로그아웃이면 로그인 된 상태기 때문에 auth미들웨어를 넣는다.
app.get("/api/users/logout", auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id },
        { token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})


//5000번 포트에서 이것이 실행된다.
//만약에 app이 5000번에 listen을 하면 해당 console이 출력
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})