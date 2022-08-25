function username(){
	document.getElementById("username_alert").style.display = "";
}

function idCheck(){
	document.getElementById("id_alert").style.display = "";
    document.getElementById("id_form").style.display = "none";
}

function email_check(){
	document.getElementById("email_alert").style.display = "";
    document.getElementById("email_form").style.display = "none";
}

  var password = document.getElementById("password").value;
  var password_check = document.getElementById("password_check").value;

//비밀번호 일치 여부 확인
function pw_check() {
	if (password != password_check){
		document.getElementById("pw_check_alert").style.display = "none";
		document.getElementById("pw_not_alert").style.display = "";
	} else {
		document.getElementById("pw_check_alert").style.display = "";
		document.getElementById("pw_not_alert").style.display = "none";
	}
}
pw_check();

//데이터 통신
function registerFood(evt) {
    evt.preventDefault(); /* POST 이벤트 중지 */
	const loginId = evt.target.loginId.value;
	const password = evt.target.password.value;
	const password_check = evt.target.password_check.value;
	const nickname = evt.target.nickname.value;
	const email = evt.target.email.value;
    if (!password || !password_check) {
      return alert('비밀번호를 확인하세요.');
    }
  
    const url = 'http://localhost:9000/users';
    const data = { loginId, password, nickname, email };
    // var obj={"loginId":loginId,"password":password,"nickname":nickname, "email":email};

    fetch('http://localhost:9000/users', {
      method: 'POST',
      headers: {
         	'Content-Type': 'application/json'
    },
      body: JSON.stringify(data),
    })
    .then((response)=>response.json())
	.then((result)=>console.log("결과: ",result));
  }
  
  document.querySelector('form').addEventListener('submit', registerFood);