const userdataBase = require("../DataBase");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { id, password } = req.body;

  const userinfo = userdataBase.find((item) => item.id === id && item.password === password);

  if (!userinfo) {
    res.status(201).json("Not Authorized");
  } else {
    try {
      const accessToken = jwt.sign(
        {
          id: userinfo.id,
          username: userinfo.username,
        },
        process.env.ACCESS_SECRET,
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
        process.env.REFRECH_SECRET,
        {
          expiresIn: "24h",
          issuer: "About Tech",
        }
      );

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  }

  console.log(userinfo);
};
const accesstoken = (req, res) => {

};
const refreshtoken = (req, res) => {
  try {
    const Token = req.cookies.refreshToken;
    const data = jwt.verify(Token, process.env.REFRECH_SECRET);
    const userdata = userdataBase.filter((item) => {
      return item.id === data.id && item.password === data.password;
    })[0];

    //accesstoken 재발급
    const accessToken = jwt.sign(
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
      accessToken,
    });
  } catch (error) {
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
      return res.status(401).json("AccessToken not provided");
    }

    const accessToken = authorizationHeader.split(' ')[1];
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
  login,
  profile,
  accesstoken,
  refreshtoken,
  loginSuccess,
  logout,
};
