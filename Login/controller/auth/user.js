const userdataBase = require("../../DataBase");
const jwt = require("jsonwebtoken");
const db = require("../../Data/db");

const login = (req, res, next) => {
    const { id, password } = req.body;
    if (id === userdataBase.id && password === userdataBase.password){
        //user
    db.query(
      "SELECT * FROM users WHERE id = ? AND password = ?",
      [id, password],
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return res.status(500).json("Internal Server Error");
        }
        if (results.length > 0) {
          res.status(404).json("Not Authorized");
        } else {
          try {
            const accessToken = jwt.sign(
              {
                id: results.id,
                username: results.username,
              },
              process.env.ACCESSh_SECRET,
              {
                expiresIn: "1m",
                issuer: "About Tech",
              }
            );
            const refreshToken = jwt.sign(
              {
                id: results.id,
                username: results.username,
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
      }
    );
  }
  };
module.exports ={
    login
}