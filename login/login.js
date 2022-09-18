const id = document.getElementById("id");
const password = document.getElementById("password");
const login = document.getElementById("login-btn");
let errStack = 0;
let message = document.querySelector("#login-msg");
function loginSuccess() {
  let link = "../main/main_login.html";
  location.href = link;
}
login.addEventListener("click", () => {
  if (id.value == "123") {
    if (password.value == "123") {
      alert("로그인 되었습니다!");
      window.localStorage.setItem("nickname", "김가현");
      const name = window.localStorage.getItem("nickname");
      loginSuccess();
    } else if (password.value == "") {
      message.innerHTML = "비밀번호를 입력해주세요.";
      password.focus();
      return;
    } else {
      id.value = null;
      password.value = null;
      errStack++;
      message.innerHTML =
        "아이디와 비밀번호를 다시 한 번 확인해주세요!" +
        " (" +
        errStack +
        "회 오류)";
    }
  } else if (id.value == "") {
    message.innerHTML = "아이디를 입력해주세요.";
    id.focus();
    return;
  } else if (password.value == "") {
    message.innerHTML = "비밀번호를 입력해주세요.";
    password.focus();
    return;
  } else {
    id.value = null;
    password.value = null;
    errStack++;
    message.innerHTML =
      "아이디와 비밀번호를 다시 한 번 확인해주세요!" +
      " (" +
      errStack +
      "회 오류)";
  }
  if (errStack >= 5) {
    alert(
      "비밀번호를 5회 이상 틀리셨습니다. 아이디/비밀번호 찾기를 권장합니다."
    );
  }
});
