const express = require("express"); // 앱이 express를 사용하겠다고 명시
const { arrayBuffer } = require("stream/consumers");
const app = express(); // 앱이 express를 사용하겠다고 명시
const port = 3100; // 로컬의 port 번호
app.use(express.json()); // express를 사용하겠다고 명시. 써야지 사용 가능.

const users = [
  {
    storeIdx: 24,
    name: "연돈",
    introduce: "백종원 골목식당 120, 121회에 출연한 식당",
    like: 87,
    image: "https://example.image-url",
    video: "https://www.youtube.com/watch?v=G0uVWsDJMVM",
    menu: ["안심 돈까스", "치즈 돈까스", "치킨 카레"],
    reviews: [
      {
        reviewIdx: 3,
        userIdx: 24,
        name: "샐리",
        profileImage: "프로필 이미지 링크",
        image: ["이미지 링크1", "이미지 링크2"],
        keyword: ["주차하기 편해요", "혼밥하기 좋아요"],
        text: "정말정말 맛있어요!!",
        createdAt: "2021-11-01T12:00:00",
        updatedAt: "2021-12-01T12:00:00",
      },
      {
        reviewIdx: 6,
        userIdx: 20,
        name: "앨리",
        profileImage: "프로필 이미지2 링크",
        image: ["이미지 링크4", "이미지 링크8"],
        keyword: ["혼밥하기 좋아요", "인테리어가 좋아요"],
        text: "전 좀 별로,,,",
        createdAt: "2021-11-01T12:00:00",
        updatedAt: "2021-12-01T12:00:00",
      },
    ],
  },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
  res.send(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/", (req, res) => {
  const newUser = req.body;

  if (Object.keys(newUser).length === 0) {
    res.status(400).send("user에 관한 정보를 입력해주세요");
  } else if (Object.keys(newUser).length < 4) {
    res
      .status(400)
      .send("user를 추가하기 위해 필요한 정보를 모두 입력해주세요");
  } else {
    users.push({
      id: users[users.length - 1].id + 1,
      ...newUser,
    });
  }

  res.json(users);
});
