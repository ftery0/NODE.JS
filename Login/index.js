const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {login} = require('./controller/auth/user')
const {createuser} = require('./controller/auth/create')
const {createPost} = require('./controller/Post/post')
const {refreshtoken} = require('./controller/auth/NewToken')
const { profile, accesstoken, loginSuccess,logout } = require("./controller/index");
const app = express();
dotenv.config();


const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "./uploads");

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 파일 크기 10MB
});


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3003",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);


app.post("/login", login);
app.get("/accesstoken", accesstoken);
app.get("/refreshtoken", refreshtoken);
app.get("/login/success", loginSuccess);
app.get("/profile", profile);
app.post("/create/post", upload.single("image"), createPost);
app.post("/createuser", createuser);
app.post("/logout", logout);

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
  console.log("Server start ", PORT);
});
