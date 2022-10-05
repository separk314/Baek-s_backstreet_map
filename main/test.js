import axios from "axios";
import fetch from "node-fetch";

const getRestList2 = async (lat1, lat2, long1, long2) => {
  console.log("실행");

  fetch("http://localhost:9000/users/loginId/dkdlel23")
    .then((data) => console.log(data))
    .catch((error) => console.log("error: ", error));
};

getRestList2(37, 38, 126, 127);
