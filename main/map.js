var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(37.5874286291778, 127.03602150310793),
  level: 3,
};
var map = new kakao.maps.Map(container, options);

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

var $search_btn = document.getElementById("search_btn");
$search_btn.addEventListener("click", search_click);

function search_click(e) {
  if (key_val.length === 0) {
    alert("키워드를 1개 이상 선택해주세요.");
  } else if (loc_val === 0) {
    alert("위치를 선택해주세요.");
  } else {
  }
}

var positions = [
  {
    title: "미식본좌",
    latlng: new kakao.maps.LatLng(37.5874286291778, 127.03602150310793),
  },
  {
    title: "생태연못",
    latlng: new kakao.maps.LatLng(33.450936, 126.569477),
  },
  {
    title: "텃밭",
    latlng: new kakao.maps.LatLng(33.450879, 126.56994),
  },
  {
    title: "근린공원",
    latlng: new kakao.maps.LatLng(33.451393, 126.570738),
  },
];

var imageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

for (var i = 0; i < positions.length; i++) {
  // 마커 이미지의 이미지 크기 입니다
  var imageSize = new kakao.maps.Size(24, 35);

  // 마커 이미지를 생성합니다
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: positions[i].latlng, // 마커를 표시할 위치
    title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    image: markerImage, // 마커 이미지
  });
}
