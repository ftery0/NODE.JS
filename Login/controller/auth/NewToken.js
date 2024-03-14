const jwt = require("jsonwebtoken");

const refreshtoken = (req, res) => {
    console.log("refresh");
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
  
  module.exports = {
    refreshtoken
  }