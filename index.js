const express = require('express')//express모듈을 가져온다.
const app = express()//가져온 express의 function을 이용해서 새로운 app을 만든다.
const port = 5000//port번호를 정한다.

//mongoDB 연결
const mongoose = require('mongoose');//mongoose모듈 가져온다.
mongoose.connect('mongodb+srv://nsh:1234@mern.btqrx.mongodb.net/<dbname>?retryWrites=true&w=majority',
{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err))

//root 디렉토리에 send()메세지를 보낸다.
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요^^.')
})

//5000번 포트에서 이것이 실행된다.
//만약에 app이 5000번에 listen을 하면 해당 console이 출력
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})