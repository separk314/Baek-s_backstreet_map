const $rest_name = document.querySelector(".rest_name");
const $like = document.querySelector("#like");
const $dislike = document.querySelector("#dislike");
const $location = document.querySelector(".location");
const $menu = document.querySelector(".menu");

const $reviewList = document.querySelector("#reviewList");
const $youtube_btn = document.querySelector(".youtube_btn");
const $channel_img = document.querySelector(".channel_img");
const $youtube_title = document.querySelector(".youtube_title");
const $uploader = document.getElementById("uploader");
const $date = document.getElementById("date");

/* <button class="edit">수정</button>
<button class="delete">삭제</button> */

const reviews = [];
// 서버 데이터 가져오기
const dataFetch = async (id) => {
  const response = await axios
    .get(`http://localhost:9000/stores/${id}/detail`)
    .then((data) => {
      const serverData = data.data;
      console.log(serverData);
      fetchYoutubeAPI(serverData.video);
      updateInfo(serverData);

      // 리뷰 1개씩 가져오기
      for (let i = 0; i < serverData.reviews.length; i++) {
        const strKeyword = putKeywords(serverData.reviews[i].keyword);

        reviews.push(
          reviewItemTemplate(
            serverData.reviews[i].name,
            serverData.reviews[i].text,
            serverData.reviews[i].createdAt.substr(0, 10),
            strKeyword,
            i
          )
        );
        $reviewList.insertAdjacentHTML("afterbegin", reviews[i]);
      }

      runModal(); // 신고하기(모달창) 실행
    });
  return response;
};

const report_click = async (reviewIdx, reason) => {
  var reasonJSON = {
    reportReason: reason,
  };
  var token = {
    "x-access-token":
      "eyJ0eXBlIjoiand0IiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWR4Ijo1LCJpYXQiOjE2NjA5ODY4ODYsImV4cCI6MTY2MjQ1ODExNX0.YmP66fyL2kofnrmJp5mWc8qPd2sUDWZU8I4mhzu-OfM",
  };
  var header = {
    headers: JSON.stringify(token),
  };
  console.log(JSON.stringify(token));
  console.log(JSON.stringify(header));

  const response = await axios
    .post(
      `http://localhost:9000/reviews/${reviewIdx}`,
      JSON.stringify(reasonJSON),
      JSON.stringify(header)
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
};

dataFetch(17);
report_click(11, 3);

// $youtube_btn.addEventListener("click", handleClick(videoLink));

function handleClick(videoLink) {
  console.log("clicked");
  window.open(videoLink);
}

// 키워드 넣기
function putKeywords(intKeyword) {
  let strKeyword = "";

  for (let i = 0; i < intKeyword.length; i++) {
    switch (intKeyword[i]) {
      case 1:
        strKeyword += `<button class="recommend">달콤해요</button>\n`;
        break;
      case 2:
        strKeyword += `<button class="recommend">담백해요</button>\n`;
        break;
      case 3:
        strKeyword += `<button class="recommend">느끼해요</button>\n`;
        break;
      case 4:
        strKeyword += `<button class="recommend">자극적이에요</button>\n`;
        break;
      case 5:
        strKeyword += `<button class="recommend">달달해요</button>\n`;
        break;
      case 6:
        strKeyword += `<button class="recommend">혼밥하기 좋아요</button>\n`;
        break;
      case 7:
        strKeyword += `<button class="recommend">친구들과 방문하기 좋아요</button>\n`;
        break;
      case 8:
        strKeyword += `<button class="recommend">가족 외식하기 좋아요</button>\n`;
        break;
      case 9:
        strKeyword += `<button class="recommend">데이트하기 좋아요</button>\n`;
        break;
      case 10:
        strKeyword += `<button class="recommend">단체 모임하기 좋아요</button>\n`;
        break;
      case 11:
        strKeyword += `<button class="recommend">친절해요</button>\n`;
        break;
      case 12:
        strKeyword += `<button class="recommend">청결해요</button>\n`;
        break;
      case 13:
        strKeyword += `<button class="recommend">인테리어가 예뻐요</button>\n`;
        break;
      case 14:
        strKeyword += `<button class="recommend">주차하기 편해요</button>\n`;
        break;
      case 15:
        strKeyword += `<button class="recommend">사진이 잘 나와요</button>\n`;
        break;
      case 16:
        strKeyword += `<button class="recommend">대중교통으로 방문하기 편해요</button>\n`;
        break;
      case 17:
        strKeyword += `<button class="recommend">야외 좌석(테라스)가 있어요</button>\n`;
        break;
      case 18:
        strKeyword += `<button class="recommend">포장 가능해요</button>\n`;
        break;
      case 19:
        strKeyword += `<button class="recommend">가성비가 좋아요</button>\n`;
        break;
      case 20:
        strKeyword += `<button class="recommend">조용해요</button>\n`;
        break;
      case 21:
        strKeyword += `<button class="recommend">애완동물 동반 가능해요</button>\n`;
        break;
    }
  }
  return strKeyword;
}

/* 신고하기 모달창 */
function runModal() {
  $(function () {
    $(".confirm").click(function () {
      //컨펌 이벤트 처리
      modalClose();
    });
    $(".modal-open").click(function () {
      $(".popup").css("display", "flex").hide().fadeIn();
    });
    $(".close").click(function () {
      modalClose();
    });
    function modalClose() {
      $(".popup").fadeOut();
    }
  });
}

// 가게 정보 업데이트
function updateInfo(data) {
  $rest_name.innerText = data["name"];
  $like.innerText = `${data["like"]} %`;
  if (data["like"] === 0) {
    $dislike.innerText = `0 %`;
  } else {
    $dislike.innerText = `${100 - data["like"]} %`;
  }
  $location.innerText = data["introduce"];
  $menu.innerText = data["menu"];
}

// 리뷰 등록 템플릿(다른 유저)
const reviewItemTemplate = (name, text, createdAt, keywords, idx) => {
  return `
  <div class="review">
  <div class="review_profile">
    <div class="profile_svgWrapper">
      <span class="profile_svg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
          />
        </svg>
      </span>
    </div>
    <div class="user_container">
      <div class="review_info">
        <span class="user_name">${name}</span>
        <span class="review_date">${createdAt}</span>
      </div>
      <div class="review_buttons">
        <button id="reviewBtn${idx}" class="modal-open">신고하기</button>  
        <div class="popup-wrap popup">
          <div class="popup-class">
            <div class="popup-body">
              <div class="body-content">
                <div class="body-titlebox">
                <span class="head-title">리뷰 신고하기</span>
                  <p>신고 사유를 선택해주세요.</p>
                </div>
                <div class="body-contentbox">
                  <div class="report_btns">
                    <button class="report_btn">부적절한 홍보</button>
                    <button class="report_btn">음란성 혹은 청소년에게 부적합한 내용</button>
                    <button class="report_btn">욕설 혹은 비방</button>
                    <button class="report_btn">같은 내용 반복 등의 도배성 리뷰</button>
                    <button class="report_btn">기타</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="popup-foot">
              <span class="pop-btn confirm">신고</span>
              <span class="pop-btn close">취소</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 키워드 -->
  <div class="keywords">
    ${keywords}
  </div>
  <div class="review_body">
    <div class="review_textContainer">
      <div calss="review_text">${text}</div>
    </div>
  </div>
  </div>
  `;
};

function fetchYoutubeAPI(youtubeURL) {
  const videoId = youtubeURL.replace("https://www.youtube.com/watch?v=", "");
  const API_KEY = "AIzaSyBaKtx4ZWhlVNcHA1VRFFE3qmEJ-GPoDWQ";

  fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&regionCode=KR&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((result) => updateYoutube(result.items[0]))
    .catch((error) => console.log(error));
}

function updateYoutube(video) {
  $youtube_title.innerText = video.snippet.title;
  $channel_img.setAttribute("src", video.snippet.thumbnails?.high.url);
  console.log($channel_img);
  $uploader.innerText = video.snippet.channelTitle;
  $date.innerText = video.snippet.publishedAt.substr(0, 10);
}
