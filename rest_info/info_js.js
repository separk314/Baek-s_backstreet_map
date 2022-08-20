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

// 서버 데이터 가져오기
const dataFetch = async (id) => {
  const response = await axios
    .get(`http://localhost:9000/stores/${id}/detail`)
    .then((data) => {
      const serverData = data.data;
      console.log(serverData);
      fetchYoutubeAPI(serverData.video);
      updateInfo(serverData);

      // getVideoLink(serverData)
      //   .then(addClick(link))
      //   .catch((message) => console.log(message));

      // 리뷰 가져오기
      const newReview = null;
      for (let i = 0; i < serverData.reviews.length; i++) {
        console.log(serverData.reviews[i]);
        const newReview = reviewItemTemplate(
          serverData.reviews[i].name,
          serverData.reviews[i].text,
          serverData.reviews[i].createdAt.substr(0, 10)
        );
        $reviewList.insertAdjacentHTML("afterbegin", newReview);
      }
    });
  return response;
};
dataFetch(17);

// youtube video link 가져오기
const getVideoLink = (data) => {
  return new Promise((resolve, reject) => {
    if (data["video"]) {
      resolve(data["video"]);
    } else {
      reject("아직 링크가 로드되지 않았음.");
    }
  });
};

// youtube link 연결
function addClick(videoLink) {
  console.log("링크 연결");
  $youtube_btn.addEventListener("click", handleClick(videoLink));
}
function handleClick(videoLink) {
  console.log("clicked");
  window.open(videoLink);
}

function updateInfo(data) {
  $rest_name.innerText = data["name"];
  $like.innerText = `${data["like"]} %`;
  $dislike.innerText = `${100 - data["like"]} %`;
  $location.innerText = data["introduce"];
  $menu.innerText = data["menu"];
}

// 리뷰 등록 템플릿(다른 유저)
const reviewItemTemplate = (name, text, createdAt) => {
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
        <button id="modal-open">신고하기</button>  
        <div class="popup-wrap" id="popup">
          <div class="popup">
            <div class="popup-body">
              <div class="body-content">
                <div class="body-titlebox">
                <span class="head-title">리뷰 신고하기</span>
                  <p>신고 사유를 선택해주세요.</p>
                </div>
                <div class="body-contentbox">
                  <div id="report_btns">
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
              <span class="pop-btn confirm" id="confirm">신고</span>
              <span class="pop-btn close" id="close">취소</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 키워드 -->
  <div class="keywords">
    <button class="recommend">추천 키워드</button>
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

/* 신고하기 모달창 */
$(function () {
  $("#confirm").click(function () {
    //컨펌 이벤트 처리
    modalClose();
  });
  $("#modal-open").click(function () {
    $("#popup").css("display", "flex").hide().fadeIn();
  });
  $("#close").click(function () {
    modalClose();
  });
  function modalClose() {
    $("#popup").fadeOut();
  }
});
