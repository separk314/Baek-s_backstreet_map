//변수 설정
//input 입력후 제출하면 ul에 표시
const div = document.querySelector("div");
const ul = document.querySelector("ul");
const button = document.querySelector("button");
const input = document.getElementById("item");
let itemsArray = [];
localStorage.setItem("items", JSON.stringify(itemsArray));

localStorage.setItem("items", JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem("items"));

//li 엘리먼트 만들고 매개변수 받은 값 li 텍스트로
const liMaker = (text) => {
  const li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);
};

div.addEventListener("submit", function (e) {
  e.preventDefault();
  liMaker(input.value);
  input.value = "";
});

data.forEach((item) => {
  console.log(item);
  liMaker(item);
});
