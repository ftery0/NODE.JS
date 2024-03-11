const db = require("../../Data/db");
const bcrypt = require('bcrypt'); 
const saltRounds = 10;

const createuser = async (req, res) => {
  const { id, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);//비밀번호 해싱

    db.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      function (error, results) {
        if (error) {
          console.error(error);
          return res.status(500).json("Internal Server Error");
        }
        if (results.length > 0) {
          return res.status(400).json("User already exists");
        }

        db.query(
          "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
          [id, username, hashedPassword], 
          function (error) {
            if (error) {
              console.error(error);
              return res.status(500).json("Internal Server Error");
            }
            res.status(200).json("User created successfully");
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
    createuser
};
