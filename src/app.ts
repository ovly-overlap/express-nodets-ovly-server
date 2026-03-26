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


app.use((req, res, next) => {
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
