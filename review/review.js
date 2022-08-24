var currentEv;
var eval = document.querySelectorAll('.eval');
var like = document.querySelector('.like');
var dislike = document.querySelector('.dislike');

function clickLikeHandler() {
  if (currentEv) {
    if (this == like) {
      currentEv.classList.remove('dislike-active');
      currentEv = this;
    }
    else if (this == dislike) {
      currentEv.classList.remove('answer-active');
      currentEv = this;
    }
  }

  if (this == like) {
    this.classList.add('answer-active');
    currentEv = this;
  }

  else if (this == dislike) {
    this.classList.add('dislike-active');
    currentEv = this;
  }
}

for (var i = 0; i < eval.length; i++) {
  eval[i].addEventListener('click', clickLikeHandler);
}


var currentMenu1;
var menuLinks1 = document.querySelectorAll('.choose-one');

function clickMenuHandler1() {
  if (currentMenu1) {
    currentMenu1.classList.remove('answer-active');
  }
  this.classList.add('answer-active');
  currentMenu1 = this;
}

for (var i = 0; i < menuLinks1.length; i++) {
  menuLinks1[i].addEventListener('click', clickMenuHandler1);
}


test = []

var currentMenu2;
var menuLinks2 = document.querySelectorAll('.choose-two');

function clickMenuHandler2() {
  /*if (currentMenu2) {
    currentMenu2.classList.remove('answer-active');
  }*/

  if (test.length > 4) {
    alert('최대 5개만 선택가능합니다.')
  } else {
    this.classList.add('answer-active');
    currentMenu2 = this;
    test.push(this);
  }
}

for (var i = 0; i < menuLinks2.length; i++) {
  menuLinks2[i].addEventListener('click', clickMenuHandler2);
}


var currentMenu3;
var menuLinks3 = document.querySelectorAll('.choose-thr');

function clickMenuHandler3() {
  if (test.length > 4) {
    alert('최대 5개만 선택가능합니다.')
  } else {
    this.classList.add('answer-active');
    currentMenu3 = this;
    test.push(this);
  }
}

for (var i = 0; i < menuLinks3.length; i++) {
  menuLinks3[i].addEventListener('click', clickMenuHandler3);
}


var currentMenu4;
var menuLinks4 = document.querySelectorAll('.choose-four');

function clickMenuHandler4() {
  if (test.length > 4) {
    alert('최대 5개만 선택가능합니다.')
  } else {
    this.classList.add('answer-active');
    currentMenu4 = this;
    test.push(this);
  }
}

for (var i = 0; i < menuLinks4.length; i++) {
  menuLinks4[i].addEventListener('click', clickMenuHandler4);
}




function getImageFiles(e) {
  const uploadFiles = [];
  const files = e.currentTarget.files;
  const imagePreview = document.querySelector('.image-list');
  const docFrag = new DocumentFragment();

  if ([...files].length >= 5) {
    alert('이미지는 최대 4개 까지 업로드가 가능합니다.');
    return;
  }

  // 파일 타입 검사
  [...files].forEach(file => {
    if (!file.type.match("image/.*")) {
      alert('이미지 파일만 업로드가 가능합니다.');
      return
    }

    // 파일 갯수 검사
    if ([...files].length < 5) {
      uploadFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = createElement(e, file);
        imagePreview.appendChild(preview);
      };
      reader.readAsDataURL(file);
    }
  });
}

function createElement(e, file) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.setAttribute('src', e.target.result);
  img.setAttribute('data-file', file.name);
  li.appendChild(img);

  return li;
}

const realUpload = document.querySelector('.upload');
const upload = document.querySelector('.upload-btn');

upload.addEventListener('click', () => realUpload.click());

realUpload.addEventListener('change', getImageFiles);