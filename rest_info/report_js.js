var $report_btn = document.getElementsByClassName("report_btn");

function handleClick(event) {
  if (event.target.classList[1] === "clicked") {
    event.target.classList.remove("clicked");
  } else {
    for (var i = 0; i < $report_btn.length; i++) {
      $report_btn[i].classList.remove("clicked");
    }

    event.target.classList.add("clicked");
  }
}

function init() {
  for (var i = 0; i < $report_btn.length; i++) {
    $report_btn[i].addEventListener("click", handleClick);
  }
}

init();
