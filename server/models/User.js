const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//bcrypt라이브러리를 가져온다.
const saltRounds = 10;//salt가 몇글자인지 나타내는것이다.(10자리)
const jwt = require('jsonwebtoken');

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

//pre()는 mongoose에서 가져온 메소드이다.
//이 메소드에 'save'를 해주면 User 모델에
//유저 정보를 저장하기 전에 무엇인가를 한다는 의미이다.

//헷갈릴점은
//user.save()할때 db에 저장되는 것
//pre()는 User모델에서 db로 저장되기전에 수행할 일을 한다.
userSchema.pre('save', function( next ) {
    console.log('[pre]save전에 무조건 실행되는 함수입니다.');
    var user = this;
    //여기서 일을 진행하고 이것이 끝나고 난 다음에 save()된다.
    //해당 함수의 파라미터에 next라는 것을 줘서 할 거 다 한다음에
    //next()으로 user.save()로 보내버린다.

    //여기서 할 일은 비밀번호를 암호화시킨다.
    //암호화를 하려면 salt를 먼저 생성한 뒤에 암호화가 진행되어야한다.
    //10자리인 salt를 만들어서 암호화를 진행한다.
    //salt를 만들때 saltRounds가 필요하다.
    //첫번째 인자에 saltRounds가 들어간다.
    if (user.isModified('password')) {
        //만약 User모델의 password가 수정될때만 암호화를 진행한다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)//에러가 나면 바로 user.save()로 보내고
    
            //salt를 제대로 생성했다면
            //메뉴얼에서 첫번째 인자인 myPlaintextPassword에는
            //클라이언트가 보낸 비밀번호가 들어가야된다.
            //해당 비밀번호는 userSchema에 저장될 것인데
            //객체형식으로 되어있으니까 userSchema.password로 비밀번호를 가져올 수 있다.
            //나는 여기서 user라는 지역변수를 선언해서 this를 저장한다.
            //이 this는 userSchema 즉 User 모델을 가리키게 된다.
    
            //두번째 인자로는 salt를 받는다.
            bcrypt.hash(user.password, salt, function(err, hash){
                //두번째 인자인 hash에는 암호화된 비밀번호가 들어온다.
                if(err) return next(err)//에러가 나면 바로 user.save()로 보낸다.
                user.password = hash;//만약 암호화에 성공했으면 비밀번호를 암호화한 hash로 교체해준다.
                //교체까지 이루어졌다면 user.save()로 돌아가야되니까 next()해준다.
                next()
            })
    
            //이곳의 문제점은 회원의 name이나 email등을 바꾸게 될때 비밀번호 암호화 부분이 똑같이 실행된다.
            //비밀번호를 변경하지 않았는데 이곳은 save()하기전에 실행되는 pre()부분이기 때문이다.
            //그렇기 때문에 비밀번호 암호화 부분은 사용자가 비밀번호를 변경할 때 실행될 수 있도록 조건을 걸어줘야된다.
        })
    } else {
        console.log('[pre]비밀번호 변경이아니라 암호화 미진행');
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    console.log('[5]비밀번호 확인 합니다.');
    //plainPassword 1234567 암호화된 비밀번호 $2b$10$zrVUMPiReOu58bRYFRkq3unmhg2O82C2X.RTP8kWWSu68Y2vBmQ6u
    //위 두개가 같은지 체크를 해야되겠죠? 그렇다면 plainPassword 암호화해서 비교를 해야된다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        console.log('[6]비밀번호 확인 후 실행되는 콜백함수입니다.');
        if(err) return cb(err);//만약 두 비밀번호가 같지 않다면 err를 뱉고
        console.log('[7]비밀번호가 일치해서 결과를 콜백함수에게 전달합니다.');
        cb(null, isMatch);//같다면 cb함수의 err에는 null을 주고 isMatch에는 isMatch를 주는데
        //여기서 isMatch는 같으니까 true겠죠?
    })
};

userSchema.methods.generateToken = function(cb) {
    console.log("[10]토큰 생성해주는 함수입니다.");
    var user = this;
    console.log('[11]this의값은', this);
    //jsonwebtoken을 이용해서 token을 생성한다.
    //_id는 DB에 있는 _id다.
    //이렇게 해주면 user._id + 'secretToken' = token이 생성되는 것이다.
    //나중에 해석할때 'secretToken'을 넣으면 user._id가 나와서
    //token을 가지고 이 사람이 누군지 알 수 있는 것이다.
    //그렇기 때문에 해당 결과를 기억해줘야 되기때문에 변수에 저장한다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    console.log('[12]생성한 token입니다.',token);
    //token을 생성할 때 문자열이 돼야하는데 user._id가 문자열이 아니라서
    //toHexString()을 사용하게 되는데 이것은
    //payload가 버퍼나 문자열이 아닌 경우 JSON.stringify를 사용하여
    //문자열로 강제 변환한다.
    
    console.log('[13]토큰을 모델에 저장합니다.');
    user.token = token;//생성된 토큰을 token필드에 저장한다.
    
    user.save(function(err, user){
        console.log('[14]몽고db에 저장을 시작합니다.');
        if(err) return cb(err)//에러가있다면 콜백에 err전달하고
        console.log('[15]잘 저장되었으므로 결과를 콜백함수한테 전달합니다.')
        cb(null, user)//save가 잘되면 err는 null이고 user정보를 전달하면
    })
}

userSchema.statics.findByToken = function( token, cb ) {
    var user = this;

    //토큰을 가져왔으면 여기서 decode(복호화)한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인한다.
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


//위의 스키마는 Model로 감싸줘야 한다.(wrapper)
//첫번째 인자 => 이 모델의 이름(Name)
//두번째 인자 => 스키마
const User = mongoose.model('User',userSchema);

//해당 Model을 다른 곳에서도 사용하고 싶다.
module.exports = { User };