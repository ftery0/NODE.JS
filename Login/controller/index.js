const userdataBase = require("../DataBase");
const jwt = require("jsonwebtoken");
const db = require("../Data/db");
const multer = require("multer");
const path = require("path");

const accesstoken = (req, res) => {};

const loginSuccess = (req, res) => {};

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
  loginSuccess,
};
