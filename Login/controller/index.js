const userdataBase = require("../DataBase");
const jwt = require("jsonwebtoken");
const db = require("../Data/db");
const multer = require("multer");
const path = require("path");


const accesstoken = (req, res) => {};
const refreshtoken = (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    if (!refreshToken) {
      return res.status(403).json("RefreshToken not provided");
    }

    const data = jwt.verify(refreshToken, process.env.REFRECH_SECRET);
    const userdata = userdataBase.find((item) => {
      return item.id === data.id && item.password === data.password;
    });

    if (!userdata) {
      return res.status(404).json("User not found");
    }

    // 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign(
      {
        id: userdata.id,
        username: userdata.username,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "1m",
        issuer: "About Tech",
      }
    );
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const loginSuccess = (req, res) => {};
const logout = (req, res) => {
  try {
    req.cookies("accessToken", "");
    res.status(200).json("success");
  } catch (error) {
    res.status(500).json(error);
  }
};
const profile = (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(403).json("AccessToken not provided");
    }

    const accessToken = authorizationHeader.split(" ")[1];
    const data = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    const userProfile = userdataBase.find((item) => {
      return item.id === data.id;
    });

    if (userProfile) {
      const { username } = userProfile;
      res.status(200).json({ data: { username } });
    } else {
      res.status(404).json("Profile not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};




module.exports = {
  profile,
  accesstoken,
  refreshtoken,
  loginSuccess,
  logout,
};
