import express from "express";
import cookieParser from "cookie-parser";
// import sequelize from "./models/index.js";
import sequelize from "@/models/index.js";

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('✅ DB Connected!');
  })
  .catch((err: Error) => {
    console.error(err);
  });


app.use((req, res, next) => { // TODO : 라ㅜ터 리팩토링 (테스트용임)
  console.log('요청 들어옴');
  next();
});
app.use(cookieParser());
app.use(express.json());
// app.use(cors());
// app.use(authMiddleware); // 전체 인증

//
// app.get("/", (_: Request, res: Response) => {
//   res.send("Hello World")
// })

// TODO : port 변경
app.listen(3000, () => {
  console.log("server running")
})
