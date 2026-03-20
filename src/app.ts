import express from "express";
import db from '../db/models/index.js';
import cookieParser from "cookie-parser";

const app = express();

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('✅ DB Connected!');
  })
  .catch((err: Error) => {
    console.error(err);
  });


// TODO : controller & service & repository
// TODO : declare router here
// TODO : dev mysql 연결

// app.js -> models/index.js - db server connection - models/article.js(모델파일) 동기화 -> article 물리 테이블 생성
app.use((req, res, next) => {
  console.log('요청 들어옴');
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(cors());
// app.use(authMiddleware); // 전체 인증

//
// app.get("/", (_: Request, res: Response) => {
//   res.send("Hello World")
// })

// TODO : port 변경
app.listen(3000, () => {
  console.log("server running")
})

//  
// 로직 설명 : router > controller > service > repository > db 
// router=경로 매핑 담당
// service=데이터가공, 검증, 
