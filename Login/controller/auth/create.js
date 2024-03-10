const db = require("../../Data/db");


const createuser = (req, res) => {
    const { id, username, password } = req.body;
    const M = req.body;
    console.log(M);
    try {
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
            `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`,
            [id, username, password],
            function (error) {
              if (error) {
                console.error(error);
                return res.status(500).json("Internal Server Error");
              }
            }
          );
          res.status(200).json("User created successfully");
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  };

module.exports = {
    createuser
}