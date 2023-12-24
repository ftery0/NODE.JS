const userdata = require("../DataBase");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { id, password } = req.body;

  const userinfo = userdata.filter((item) => {
    return item.id === id && item.password === password;
  })[0];

  if (!userinfo) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      const accessToken = jwt.sign(
        {
          id: userinfo.id,
          username: userinfo.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1m",
          issuer: "About Tech",
        }
      );
      const refreshToken = jwt.sign(
        {
          id: userinfo.id,
          username: userinfo.username,
        },
        process.env.REFRECH_TOKEN_SECRET,
        {
          expiresIn: "24h",
          issuer: "About Tech",
        }
      );

      //Token 전송 코드
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie("accessToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });
      res.status(200).json("success");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  }
  console.log(userinfo);
  next();
};
const accesstoken = (req, res) => {};
const refreshtoken = (req, res) => {};
const loginSuccess = (req, res) => {};
const logout = (req, res) => {};

module.exports = {
  login,
  accesstoken,
  refreshtoken,
  loginSuccess,
  logout,
};
