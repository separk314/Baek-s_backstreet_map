const id = document.getElementById('id');
const password = document.getElementById('password');
const login = document.getElementById('login-btn');
let errStack = 0;
let message = document.querySelector('#login-msg');

function loginSuccess() {
    let link = 'header.html';
    location.href = link;
}

login.addEventListener('click', () => {
    if (id.value == 'kahyun0817@naver.com') {
        if (password.value == 'abcdefg1234!') {
            alert('로그인 되었습니다!');
            loginSuccess();
        }
        else {
            alert('아이디와 비밀번호를 다시 한 번 확인해주세요!');
            id.value = null;
            password.value = null;
            errStack ++;
            message.innerHTML = '*빨간 경고 문구 입력창입니다.'
        }
    }

    else if (id.value == null) {
        alert('아이디와 비밀번호를 입력해주세요.');
    }

    else {
        alert('존재하지 않는 계정입니다.')
    }

    if (errStack >= 5) {
        alert('비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 권장합니다.');
    }
})