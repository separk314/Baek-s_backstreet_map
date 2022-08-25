const express = require("express"); // 앱이 express를 사용하겠다고 명시
const { arrayBuffer } = require("stream/consumers");
const app = express(); // 앱이 express를 사용하겠다고 명시
const port = 9000; // 로컬의 port 번호
app.use(express.json()); // express를 사용하겠다고 명시

const users = [];

app.get("/stores/1/detail", (req, res) => {
  console.log("get users' data 5");
  res.json(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
