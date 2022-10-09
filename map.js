// 임시 데이터

// import axios from "axios";

// axios.defaults.baseURL = "baeksstreetmap.shop";

let temp = {};

var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(37.5874286291778, 127.03602150310793),
  level: 8,
};
var map = new kakao.maps.Map(container, options);
const $result_list = document.getElementById("result-list"); // 검색 결과
const rest_elements = []; // $result_list에 추가한 식당 정보들
var infowindow = null; // mouseover 했을 때 표시되는 window(가게 정보화면)

var positions = []; // 위치 정보 리스트
var markers = []; // 지도 마커 리스트

// keyword, location 선택하기
var $key_btns = document.querySelectorAll(".keyword");
var $loc_btns = document.getElementsByClassName("loc_btn");
var key_val = [];
var loc_val = 0;
// eventHandler 추가
[].forEach.call($key_btns, function (key_btn) {
  key_btn.addEventListener("click", key_click);
});
for (var i = 0; i < $loc_btns.length; i++) {
  $loc_btns[i].addEventListener("click", loc_click);
}

function key_click(e) {
  const clicked_val = e.target.getAttribute("id");

  if (key_val.includes(clicked_val)) {
    // 이미 클릭한 키워드의 경우 배열에서 삭제
    for (var i = 0; i < key_val.length; i++) {
      if (key_val[i] === clicked_val) {
        key_val.splice(i, 1);
        break;
      }
    }
    document.getElementById(clicked_val).style.background = "white";
    document.getElementById(clicked_val).style.color = "#7D1818";
  } else {
    key_val.push(clicked_val);
    document.getElementById(clicked_val).style.background = "#C78080";
    document.getElementById(clicked_val).style.color = "white";
  }
}

// const getRestList2 = async (lat1, lat2, long1, long2) => {
//   console.log("실행");

//   const response = await axios
//     .get(`baeksstreetmap.shop/stores/11`)
//     .then((data) => console.log(data))
//     .catch((error) => console.log("error: ", error));
// };

function loc_click(e) {
  console.log(e.target.getAttribute("id"));
  getRestList2(37, 38, 126, 127);

  if (e.target.classList[1] === "loc_clicked") {
    e.target.classList.remove("loc_clicked");
    loc_val = 0;
  } else {
    for (var i = 0; i < $loc_btns.length; i++) {
      $loc_btns[i].classList.remove("loc_clicked");
    }
    e.target.classList.add("loc_clicked");
  }

  loc_val = e.target.getAttribute("id");
}

// 검색하기 버튼
var $search_btn = document.getElementById("search_btn");
$search_btn.addEventListener("click", search_click);

function search_click() {
  if (key_val.length === 0) {
    alert("키워드를 1개 이상 선택해주세요.");
  } else if (loc_val === 0) {
    alert("위치를 선택해주세요.");
  } else {
    removeAllChildNods($result_list); // 기존에 있던 검색 결과 삭제
    removeMarker(); // 지도에 표시된 마커 제거

    moveLocMap(loc_val); // 선택한 위치로 이동
    let boundsStr = map.getBounds().toString(); // ((남,서), (북,동))
    let coor_list = boundsStr.split(/[(,)]/);
    temp = getRestList(coor_list[2], coor_list[6], coor_list[3], coor_list[7]);
  }
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 기존 검색 결과창을 제거
function removeAllChildNods(list) {
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
}

async function makeMark(position) {
  var imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
  var imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기 입니다
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다

  return new Promise((resolve, reject) => {
    // 마커를 생성
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: position.latlng, // 마커를 표시할 위치
      // title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
      image: markerImage, // 마커 이미지
      clickable: true,
    });

    // marker.setMap(map); // 지도 위에 마커 표출
    markers.push(marker); // 마크 리스트에 추가
    resolve(marker);
  });
}

const restTemplate = (name, menu) => {
  return `
    <div class="result">
            <div class="rest-name">${name}</div>
            <div class="rest-menu">${menu}</div>
          </div>
    `;
};

async function fetchRestInfo(idx) {
  const response = fetch(`/${idx}`);
  return response;
}

function loadRestInfo(idx, i, restList) {
  fetchRestInfo(idx)
    .then((res) => res.json())
    .then((data) => {
      const rest = {
        title: data.name,
        latlng: new kakao.maps.LatLng(
          restList.data[i].latitude,
          restList.data[i].longitude
        ),
      };
      positions.push(rest);
      printRestMarkers(rest, data, i);
      console.log(data);
    });
}

async function printRestMarkers(rest, data, i) {
  try {
    makeMark(rest)
      .then((marker) => {
        console.log("음식점 data: ", data);

        rest_elements.push(restTemplate(data.name, data.bestMenu));
        //   검색결과 리스트에 출력
        $result_list.insertAdjacentHTML(
          "afterbegin",
          rest_elements[rest_elements.length - 1]
        );

        //   rest_elements[rest_elements.length - 1].onmouseover = function () {
        //     displayInfowindow(marker, data);
        //   };

        kakao.maps.event.addListener(marker, "click", function () {
          displayInfowindow(marker, data);
        });
      })
      .catch((error) => console.log(error));
  } catch (e) {
    console.log(e);
  }
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, data) {
  console.log("data: ", data);

  let changed_text = "";
  if (data.change === 1) {
    changed_text = "방송 이후에도 여전히 맛있어요!";
  } else if (data.$change === 2) {
    changed_text = "맛과 퀄리티가 보통이에요";
  } else if (data.$change === 3) {
    changed_text = "맛과 퀄리티가 별로예요";
  }

  const keywords_text = [];
  for (let i = 0; i < 3; i++) {
    switch (data.keyword[i]) {
      case 1:
        keywords_text.push(`<button class="recommend">달콤해요</button>\n`);
        break;
      case 2:
        keywords_text.push(`<button class="recommend">담백해요</button>\n`);
        break;
      case 3:
        keywords_text.push(`<button class="recommend">느끼해요</button>\n`);
        break;
      case 4:
        keywords_text.push(`<button class="recommend">자극적이에요</button>\n`);
        break;
      case 5:
        keywords_text.push(`<button class="recommend">달달해요</button>\n`);
        break;
      case 6:
        keywords_text.push(
          `<button class="recommend">혼밥하기 좋아요</button>\n`
        );
        break;
      case 7:
        keywords_text.push(
          `<button class="recommend">친구들과 방문하기 좋아요</button>\n`
        );
        break;
      case 8:
        keywords_text.push(
          `<button class="recommend">가족 외식하기 좋아요</button>\n`
        );
        break;
      case 9:
        keywords_text.push(
          `<button class="recommend">데이트하기 좋아요</button>\n`
        );
        break;
      case 10:
        keywords_text.push(
          `<button class="recommend">단체 모임하기 좋아요</button>\n`
        );
        break;
      case 11:
        keywords_text.push(`<button class="recommend">친절해요</button>\n`);
        break;
      case 12:
        keywords_text.push(`<button class="recommend">청결해요</button>\n`);
        break;
      case 13:
        keywords_text.push(
          `<button class="recommend">인테리어가 예뻐요</button>\n`
        );
        break;
      case 14:
        keywords_text.push(
          `<button class="recommend">주차하기 편해요</button>\n`
        );
        break;
      case 15:
        keywords_text.push(
          `<button class="recommend">사진이 잘 나와요</button>\n`
        );
        break;
      case 16:
        keywords_text.push(
          `<button class="recommend">대중교통으로 방문하기 편해요</button>\n`
        );
        break;
      case 17:
        keywords_text.push(
          `<button class="recommend">야외 좌석(테라스)가 있어요</button>\n`
        );
        break;
      case 18:
        keywords_text.push(
          `<button class="recommend">포장 가능해요</button>\n`
        );
        break;
      case 19:
        keywords_text.push(
          `<button class="recommend">가성비가 좋아요</button>\n`
        );
        break;
      case 20:
        keywords_text.push(`<button class="recommend">조용해요</button>\n`);
        break;
      case 21:
        keywords_text.push(
          `<button class="recommend">애완동물 동반 가능해요</button>\n`
        );
        break;
      default:
        keywords_text.push("");
    }
  }
  var content_html = `<div class="infoWindow">
  <div class="info_header">
    <span class="title">${data.name}</span>
    <span class="like_dislike">
    <span class="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M128 447.1V223.1c0-17.67-14.33-31.1-32-31.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64C113.7 479.1 128 465.6 128 447.1zM512 224.1c0-26.5-21.48-47.98-48-47.98h-146.5c22.77-37.91 34.52-80.88 34.52-96.02C352 56.52 333.5 32 302.5 32c-63.13 0-26.36 76.15-108.2 141.6L178 186.6C166.2 196.1 160.2 210 160.1 224c-.0234 .0234 0 0 0 0L160 384c0 15.1 7.113 29.33 19.2 38.39l34.14 25.59C241 468.8 274.7 480 309.3 480H368c26.52 0 48-21.47 48-47.98c0-3.635-.4805-7.143-1.246-10.55C434 415.2 448 397.4 448 376c0-9.148-2.697-17.61-7.139-24.88C463.1 347 480 327.5 480 304.1c0-12.5-4.893-23.78-12.72-32.32C492.2 270.1 512 249.5 512 224.1z"
              />
            </svg>
          </span>
      <span class="like">${data.like} %</span>
      <span class="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M96 32.04H32c-17.67 0-32 14.32-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V64.03C128 46.36 113.7 32.04 96 32.04zM467.3 240.2C475.1 231.7 480 220.4 480 207.9c0-23.47-16.87-42.92-39.14-47.09C445.3 153.6 448 145.1 448 135.1c0-21.32-14-39.18-33.25-45.43C415.5 87.12 416 83.61 416 79.98C416 53.47 394.5 32 368 32h-58.69c-34.61 0-68.28 11.22-95.97 31.98L179.2 89.57C167.1 98.63 160 112.9 160 127.1l.1074 160c0 0-.0234-.0234 0 0c.0703 13.99 6.123 27.94 17.91 37.36l16.3 13.03C276.2 403.9 239.4 480 302.5 480c30.96 0 49.47-24.52 49.47-48.11c0-15.15-11.76-58.12-34.52-96.02H464c26.52 0 48-21.47 48-47.98C512 262.5 492.2 241.9 467.3 240.2z"
              />
            </svg>
          </span>
      <span class="dislike">${data.like === 0 ? 0 : 100 - data.like}%</span>
    </span>
  </div>
  <hr />
  <div class="info_body">
    <div class="changed">${changed_text}</div>
    <div class="bestMenu">가장 인기 있는 메뉴는 ${data.bestMenu}입니다.</div>
    <div class="keywords_list">
        <span>키워드: </span>${keywords_text[0]} ${keywords_text[1]} ${
    keywords_text[2]
  }</div>
  </div>
  <div id="viewBtn_container">
    <button id="viewBtn"}>더보기</button>
  </div>
</div>`;

  infowindow = new kakao.maps.InfoWindow({
    content: content_html,
    removable: true,
  });
  infowindow.open(map, marker);

  $viewBtn = document.getElementById("viewBtn");
  $viewBtn.addEventListener("click", function (event) {
    localStorage.setItem("local_storeIdx", data.storeIdx);
    window.open("../rest_info/info.html");
  });
}

const getRestList = async (lat1, lat2, long1, long2) => {
  const response = await axios
    .get(
      `baeksstreetmap.shop/stores?latitudes=${lat1},${lat2}&longitudes=${long1}, ${long2}`
    )
    .then((data) => {
      temp = data;
      return temp;
    })
    .then((response) => {
      // 음식점 정보 가져오기
      for (let i = 0; i < response.data.length; i++) {
        loadRestInfo(response.data[i].storeIdx, i, response);
      }
    })
    .catch((error) => {
      console.log("fetchData error: ", error);
    });
  return response;
};

function moveLocMap(location) {
  var moveLatLon = null;
  switch (location) {
    case "seoul":
      moveLatLon = new kakao.maps.LatLng(37.56667, 126.97806);
      map.setLevel(9);
      break;
    case "gyeonggi":
      moveLatLon = new kakao.maps.LatLng(37.52321, 126.9937);
      map.setLevel(10);
      break;
    case "incheon":
      moveLatLon = new kakao.maps.LatLng(37.45639, 126.70528);
      map.setLevel(9);
      break;
    case "busan":
      moveLatLon = new kakao.maps.LatLng(35.17944, 129.07556);
      map.setLevel(9);
      break;
    case "daegu":
      moveLatLon = new kakao.maps.LatLng(35.87125, 128.60074);
      map.setLevel(8);
      break;
    case "daejeon":
      moveLatLon = new kakao.maps.LatLng(36.35014, 127.38416);
      map.setLevel(8);
      break;
    case "gwangju":
      moveLatLon = new kakao.maps.LatLng(35.1597, 126.85097);
      map.setLevel(7);
      break;
    case "gyeongnam":
      moveLatLon = new kakao.maps.LatLng(35.23711, 128.69016);
      map.setLevel(11);
      break;
    case "gyeongbuk":
      moveLatLon = new kakao.maps.LatLng(36.57193, 128.49967);
      map.setLevel(11);
      break;
    case "ulsan":
      moveLatLon = new kakao.maps.LatLng(35.5392, 129.31093);
      map.setLevel(7);
      break;
    case "gangwon":
      moveLatLon = new kakao.maps.LatLng(37.77022, 128.29494);
      map.setLevel(11);
      break;
    case "chungnam":
      moveLatLon = new kakao.maps.LatLng(36.56966, 126.84156);
      map.setLevel(10);
      break;
    case "chungbuk":
      moveLatLon = new kakao.maps.LatLng(36.76114, 127.7815);
      map.setLevel(10);
      break;
    case "jeonnam":
      moveLatLon = new kakao.maps.LatLng(34.89156, 126.95489);
      map.setLevel(10);
      break;
    case "jeonbuk":
      moveLatLon = new kakao.maps.LatLng(35.81951, 127.10724);
      map.setLevel(10);
      break;
    case "jeju":
      moveLatLon = new kakao.maps.LatLng(33.36861, 126.52647);
      map.setLevel(10);
      break;
  }

  map.panTo(moveLatLon);
}
