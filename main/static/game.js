import { postData } from "./postdata.js";
import { locDict } from "./locations.js";

var map = L.map("map").setView([51.505, -0.09], 1);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker;
var guess;
var markerLoc;
var locGame = JSON.parse(JSON.stringify(locDict));
var loc;
var question = 1;
var score = 0;
nextQuestion();
var polyline;
var distance;
var currPos;

function nextQuestion() {
  if (question !== 1) {
    locGame.location.splice(currPos, 1);
  }
  min = Math.ceil(0);
  max = Math.floor(locGame.location.length - 1);
  currPos = Math.floor(Math.random() * (max - min + 1)) + min;
  loc = locGame.location[currPos];
  document.getElementById("locationName").innerHTML = loc.name;
  document.getElementById("roundCount").innerHTML = "Runda: " + question + "/4";
  document.getElementById("currScore").innerHTML = "Wynik: " + score;
}

function onMapClick(e) {
  if (!marker && question < 5) {
    guess = e.latlng;
    marker = L.marker([guess.lat, guess.lng]);
    marker.addTo(map);
  } else {
    guess = e.latlng;
    marker.setLatLng([guess.lat, guess.lng]);
  }
}

function onSubmitClick() {
  if (marker && question < 5) {
    distance = getDistance([guess.lat, guess.lng], [loc.lat, loc.lon]) / 1000;
    var scoreRound = 500 - distance / 2;
    if (scoreRound < 0) scoreRound = 0;
    score += Math.round(scoreRound);

    var lineCoord = [
      [guess.lat, guess.lng],
      [loc.lat, loc.lon],
    ];
    polyline = L.polyline(lineCoord, { color: "red" }).addTo(map);
    markerLoc = L.circleMarker([loc.lat, loc.lon]);
    markerLoc.addTo(map);

    var zoom;
    if (distance > 20) {
      zoom = 10;
    }
    if (distance > 60) {
      zoom = 7;
    }
    if (distance > 100) {
      zoom = 6;
    }
    if (distance > 500) {
      zoom = 5;
    }
    if (distance > 1000) {
      zoom = 4;
    }
    if (distance > 2000) {
      zoom = 3;
    }
    if (distance > 5000) {
      zoom = 1;
    }

    map.setView([loc.lat, loc.lon], zoom);
    if (question === 4) {
      //console.log(score)
      document.getElementById("nextGame").innerHTML =
        "Koniec gry! Twój wynik to: " +
        score +
        "\nAby rozpocząć nową grę, naciśnij przycisk 'Nowa Gra'";
      question++;
      document.getElementById("new_game").value = score;
      postData("/game", { score: score }).then((data) => {
        console.log(data);
      });
      var roundScore = document.getElementById("new_game").value;
      console.log(roundScore);
    }
  }
}

function clearMap() {
  map.removeLayer(markerLoc);
  map.removeLayer(marker);
  marker = null;
  map.removeLayer(polyline);
}

function onNextClick() {
  if (question < 4) {
    clearMap();
    question++;
    nextQuestion();
    map.setView([51.505, -0.09], 1);
  }
}

function getDistance(origin, destination) {
  // return distance in meters
  var lon1 = toRadian(origin[1]),
    lat1 = toRadian(origin[0]),
    lon2 = toRadian(destination[1]),
    lat2 = toRadian(destination[0]);

  var deltaLat = lat2 - lat1;
  var deltaLon = lon2 - lon1;

  var a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

function onNewGame() {
  score = 0;
  question = 1;
  locGame = JSON.parse(JSON.stringify(locDict));
  clearMap();
  nextQuestion();
  document.getElementById("nextGame").innerHTML = "";
  map.setView([51.505, -0.09], 1);
}

map.on("click", onMapClick);
