require('dotenv').config();
const userdataBase = require("../../DataBase");
const jwt = require("jsonwebtoken");
const db = require("../../Data/db");
const bcrypt = require('bcrypt');

function checkPassword(inputPassword, storedHash) {
  return bcrypt.compareSync(inputPassword, storedHash);
}

const login = (req, res, next) => {
    const { id, password } = req.body;

    // 환경 변수 값이 정의 확인
    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      console.error("ACCESS_SECRET or REFRESH_SECRET error");
      return res.status(500).json("Internal Server Error due to configuration issues"); 
    }

    db.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      function (error, results) {
        if (error) {
          console.error(error);
          return res.status(500).json("Internal Server Error");
        }
        if (results.length === 0) {
          return res.status(401).json("Not Authorized");
        } else {
          const user = results[0]; 
          if (!checkPassword(password, user.password)) {
            return res.status(401).json("Not Authorized");
          }
          try {
            const accessToken = jwt.sign(
              {
                id: user.id,
                username: user.username,
              },
              process.env.ACCESS_SECRET, 
              {
                expiresIn: "1m",
                issuer: "About Tech",
              }
            );
            const refreshToken = jwt.sign(
              {
                id: user.id,
                username: user.username,
              },
              process.env.REFRESH_SECRET, 
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
            console.log("success to log in user "+id);
          } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
          }
        }
      }
    );
};

module.exports = {
    login
};
