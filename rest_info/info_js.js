const $reviewList = document.querySelector("#reviewList");
const $channel_img = document.querySelector(".channel_img");
const $youtube_title = document.querySelector(".youtube_title");
const $uploader = document.getElementById("uploader");
const $date = document.getElementById("date");

/* <button class="edit">수정</button>
<button class="delete">삭제</button> */

const reviewItemTemplate = (newReview) => {
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
      <span class="user_name">숨마번</span>
      <span class="review_date">2022.07.14</span>
    </div>
    <div class="review_buttons">
      <button class="report">신고하기</button> 
    </div>
  </div>
</div>
<!-- 키워드 -->
<div class="keywords">
  <button class="recommend">우동 추천해요</button>
</div>
<div class="review_body">
  <div class="review_imgWrapper">
    <img src="sampel_food.jpg" />
  </div>
  <div class="review_textContainer">
    <div calss="review_text">${newReview}</div>
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
  console.log(video);
  $youtube_title.innerText = video.snippet.title;
  $channel_img.innerHTML = `<img class="channel_img" src=${video.snippet.thumbnails?.high.url} />`;
  $uploader.innerText = video.snippet.channelTitle;
  $date.innerText = video.snippet.publishedAt.substr(0, 10);
}

function openWindow() {
  var popupWidth = 400;
  var popupHeight = 500;
  var popupX = window.screen.width / 2 - popupWidth / 2;
  var popupY = window.screen.height / 2 - popupHeight / 2;

  window.open(
    "report.html",
    "신고 화면",
    "status=no, height=" +
      popupHeight +
      ", width=" +
      popupWidth +
      ", left=" +
      popupX +
      ", top=" +
      popupY
  );
}

const newReview = reviewItemTemplate("첫 번째 리뷰");
$reviewList.insertAdjacentHTML("afterbegin", newReview);

const newReview2 = reviewItemTemplate("두 번째 리뷰");
$reviewList.insertAdjacentHTML("afterbegin", newReview2);

const newReview3 = reviewItemTemplate("세 번째 리뷰");
$reviewList.insertAdjacentHTML("afterbegin", newReview3);

const $report = document.querySelector(".report");
$report.addEventListener("click", openWindow);

fetchYoutubeAPI("https://www.youtube.com/watch?v=G0uVWsDJMVM");
