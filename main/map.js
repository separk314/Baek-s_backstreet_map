// 임시 데이터
let temp = {
  item: [
    {
      storeIdx: 24,
      name: "연돈",
      latitude: 37.5578623,
      longitude: 126.9459631,
    },
    {
      storeIdx: 32,
      name: "이대 라멘집",
      latitude: 37.5608335,
      longitude: 126.9963719,
    },
  ],
};

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
function loc_click(e) {
  console.log(e.target.getAttribute("id"));
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
    console.log("boundsStr", coor_list);
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

function makeMark(position) {
  var imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
  var imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기 입니다
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다

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
}

const restTemplate = (name, menu) => {
  return `
    <div class="result">
            <div class="rest-name">${name}</div>
            <div class="rest-menu">${menu}</div>
          </div>
    `;
};

const getRestInfo = async (idx, i, restList) => {
  console.log(idx, i, restList);
  const response = await axios
    .get(`http://localhost:9000/stores/${idx}`)
    .then((data) => {
      const rest = {
        title: data.data.name,
        latlng: new kakao.maps.LatLng(
          restList.data[i].latitude,
          restList.data[i].longitude
        ),
      };

      positions.push(rest);
      makeMark(rest); // 지도에 마크 표시
      console.log(data.data);

      rest_elements.push(restTemplate(data.data.name, data.data.bestMenu));
      //   검색결과 리스트에 출력
      $result_list.insertAdjacentHTML(
        "afterbegin",
        rest_elements[rest_elements.length - 1]
      );

      makeInfoWindow(
        markers[i],
        data.data,
        rest_elements[rest_elements.length - 1]
      );
    });

  return response;
};

// 마커와 검색결과 항목에 mouseover 했을때
// 해당 장소에 인포윈도우에 장소명을 표시합니다
// mouseout 했을 때는 인포윈도우를 닫습니다
function makeInfoWindow(marker, data, rest_element) {
  const itemEl = rest_element;

  kakao.maps.event.addListener(marker, "click", function () {
    console.log(itemEl);
    console.log("clicked");
    displayInfowindow(marker, data);
  });

  //   kakao.maps.event.addListener(marker, "click", function () {
  //     infowindow.close();
  //   });

  itemEl.onmouseover = function () {
    displayInfowindow(marker, data);
  };

  itemEl.onmouseout = function () {
    infowindow.close();
  };
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
      <span class="like">${data.like} %</span>
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
  console.log(marker);

  $viewBtn = document.getElementById("viewBtn");
  $viewBtn.addEventListener("click", function (event) {
    localStorage.setItem("local_storeIdx", data.storeIdx);
    window.open("../rest_info/info.html");
  });
}

const getRestList = async (lat1, lat2, long1, long2) => {
  const response = await axios
    .get(
      `http://localhost:9000/stores?latitudes=${lat1},${lat2}&longitudes=${long1}, ${long2}`
    )
    .then((data) => {
      console.log("바운더리 식당 조회 성공:", data);
      temp = data;
      return temp;
    })
    .then((response) => {
      // 음식점 정보 가져오기
      for (let i = 0; i < response.data.length; i++) {
        console.log("음식점 정보 가져오기:", response.data[i]);
        getRestInfo(response.data[i].storeIdx, i, response);
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
