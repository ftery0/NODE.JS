const db = require("../../Data/db");


const createPost = (req, res) => {
    const { userId, title, content } = req.body;
    const image = req.file; // 이미지 파일
  
    try {
      // 이미지 파일이 있는지 확인
      if (!image) {
        return res.status(400).json("Image file not provided");
      }
  
      // 이미지 파일을 업로드하고 파일 경로를 받아옴
      const imagePath = image.path;
  
      // 게시물 정보를 데이터베이스에 저장
      db.query(
        "INSERT INTO posts (userId, title, content, imageUrl) VALUES (?, ?, ?, ?)",
        [userId, title, content, imagePath],
        function (error, results) {
          if (error) {
            console.error(error);
            return res.status(500).json("Internal Server Error");
          }
  
          res.status(200).json("Post created successfully");
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  };
module.exports = {
    createPost,
}