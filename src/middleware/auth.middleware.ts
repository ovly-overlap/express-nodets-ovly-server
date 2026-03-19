import { getSession } from "@auth/express";
import { NextFunction } from "express";


// middleware/auth.middleware.ts
export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.user = decodeToken(token)
  next()
}


export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = res.locals.session ?? (await getSession(req, authConfig))
  if (!session?.user) {
    res.redirect("/login")
  } else {
    next()
  }
}



userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    
    // verify a token symmetric //토큰을 디코드 한다.
    //decoded -> userId
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //console.log(decoded.foo) // bar
        
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 저장된 토큰이 일치하는지 확인한다. 
        user.findOne({"_id" : decoded, "token" : token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
}

const { User } = require('../models/User');

//인증 처리를 위한 곳. 
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져온다. 
    let token = req.cookies.x_auth;

    //토큰을 복호화한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({isAuth : false, err : true}); //유저가 없으면 인증 no.

        //유저가 있으면 인증 Ok
        req.token = token; //req에 넣어주므로, 라우트에서 사용할 수 있도록함. 
        req.user = user;
        next(); //-> 미들웨어이므로, 다음 단계로 전진할 수 있도록함. 
    });
}

module.exports = { auth };


app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과했다는 얘기는 aus가 통과.
  res.status(200).json({
    _id : req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname, 
    role : req.user.role, 
    image : req.user.image
  });

});