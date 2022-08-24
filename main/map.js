// 임시 데이터
const temp = {
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

var positions = []; // map marks

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
    moveLocMap(loc_val); // 선택한 위치로 이동
    let boundsStr = map.getBounds().toString(); // ((남,서), (북,동))

    // 음식점 정보 가져오기
    for (let i = 0; i < temp.item.length; i++) {
      getRestInfo(temp.item[i].storeIdx, i, temp);
    }
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
    title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
    image: markerImage, // 마커 이미지
  });
}

const getRestInfo = async (idx, i, restList) => {
  const response = await axios
    .get(`http://localhost:9000/stores/${idx}`)
    .then((data) => {
      const rest = {
        title: data.data.name,
        latlng: new kakao.maps.LatLng(
          restList.item[i].latitude,
          restList.item[i].longitude
        ),
      };

      positions.push(rest);
      makeMark(rest); // 지도에 마크 표시
    });

  return response;
};

const getRestList = async (co1, co2, co3, co4) => {
  // co1: 북동, cor2: 북서, cor3: 남서, cor4:
  const response = await axios
    .get(`http://localhost:9000/stores`)
    .then()
    .catch();
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
