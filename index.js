const express = require('express')//express모듈을 가져온다.
const app = express()//가져온 express의 function을 이용해서 새로운 app을 만든다.
const port = 5000//port번호를 정한다.
const bodyParser = require('body-parser');//body-parser모듈 가져오기

const config = require('./config/key');


//bodyParser옵션 주기
//application/x-www-form-urlencoded로 되어있는 데이터를 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.urlencoded({extended: true}));

//application/json로 되어있는 데이터를 분석해서 가져올 수 있도록 해주는 코드
app.use(bodyParser.json());


//모델 가져오기
const { User } = require('./models/User');

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

//회원가입을 위한 Register Route 생성
app.post('/register', (req, res) => {
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











//5000번 포트에서 이것이 실행된다.
//만약에 app이 5000번에 listen을 하면 해당 console이 출력
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})