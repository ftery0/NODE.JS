const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mysql = require("mysql");
const {
  login,
  profile,
  accesstoken,
  refreshtoken,
  loginSuccess,
  createuser,
  logout,
} = require("./controller/index");
const app = express();
dotenv.config();

// 기본 설정
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.post("/login", login);
app.get("/accesstoken", accesstoken);
app.get("/refreshtoken", refreshtoken);
app.get("/login/success", loginSuccess);
app.get("/profile",  profile)
app.post("/createuser", createuser);
app.post("/logout", logout);

const PORT = process.env.PORT || 8080; // PORT가 정의되지 않았을 때 기본값 8080 사용
app.listen(PORT, () => {
  console.log("Server start ", PORT);
});
