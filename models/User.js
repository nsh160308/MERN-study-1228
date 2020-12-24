const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    //유저와 관련된 필드를 작성
    name: {
        type: String,
        maxlength: 50
        //maxlength => 최대길이는 50이다.
    },
    email: {
        type: String,
        trim: true, 
        unique: 1 
        //trim => 사용자가 공백문자를 포함해서 이메일을 입력했을 때 공백을 없앤다.
        //unique => 이메일은 고유했으면 좋겠다.
    },
    password: {
        type: String,
        minlength: 5
        //minlength => 최소길이는 5이다. 
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, 
        default: 0 
        //role은 사용자에게 권한을 주는 것이다.
        //default => role로 권한을 주지 않았다면 default로 0을 주겠다.
    },
    image: String, //그 사람에 해당하는 이미지를 줄 수 있다.
    token: {
        type: String
        //유효성을 관리한다.
    },
    tokenExp: {
        type: Number
        //토큰의 사용기간을 관리한다.
    }
})

//위의 스키마는 Model로 감싸줘야 한다.(wrapper)
//첫번째 인자 => 이 모델의 이름(Name)
//두번째 인자 => 스키마
const User = mongoose.model('User',userSchema);

//해당 Model을 다른 곳에서도 사용하고 싶다.
module.exports = { User };