const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TodoList = [
  {
    id: 1,
    text: "할일1",
    done: false,
  },
];

app.get("/api/todo", (req, res) => {
  res.json(TodoList);
});
app.post("/api/todo", (req, res) => {
  const text1 = req.body.text;
  const done1 = req.body.done;
  TodoList.push({
    id: id++,
    text1,
    done1,
  });
  return res.send("success");
});

app.listen(4000, () => {
  console.log("server start");
});
