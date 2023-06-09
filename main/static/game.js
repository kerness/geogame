var map = L.map('map').setView([25, 0], 2);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    dragging: false
}).addTo(map);

var marker;
var guess;
var markerLoc;
const locDict ={
  location:
      [{  name: "Londyn",
          lat : 51.5,
          lon : -0.13},
      {  name: "Kijów",
          lat : 50.45,
          lon : 30.52},
      {  name: "Kraków",
          lat : 50.06,
          lon : 19.94},
      {  name: "Praga",
          lat : 50.07,
          lon : 14.41},
      {  name: "Ułan Bator",
          lat : 47.92,
          lon : 106.92},
      {  name: "Nowy Orlean",
          lat : 29.95,
          lon : -90.07},
      {  name: "Torronto",
          lat : 43.65,
          lon : -79.34},
      {  name: "Tokio",
          lat : 35.65,
          lon : 139.82},
      {  name: "Hawana",
          lat : 23.11,
          lon : -82.36},
      {  name: "Melbourne",
          lat : -37.84,
          lon : 144.94}
      ]
};
var locGame = JSON.parse(JSON.stringify((locDict)));
var loc;
var question = 1
var score = 0
nextQuestion();
var polyline;
var distance;


var currPos;

function nextQuestion(){

    if(question !== 1){
        locGame.location.splice(currPos,1);
}
    min = Math.ceil(0);
    max = Math.floor(locGame.location.length-1);
    currPos = Math.floor(Math.random() * (max - min + 1)) + min;
    loc = locGame.location[currPos];
    document.getElementById("locationName").innerHTML = loc.name;
    document.getElementById("roundCount").innerHTML = "Runda: "+question+"/4";

}

function onMapClick(e) {
    if (!marker && question <5)
    {
        guess = e.latlng
        marker = L.marker([guess.lat, guess.lng]);
        marker.addTo(map);
    }
    else
    {
        guess = e.latlng;
        marker.setLatLng([guess.lat, guess.lng]);

    }
}
function onSubmitClick() {
    if (marker && question < 5 ) {

        distance = getDistance([guess.lat, guess.lng], [loc.lat, loc.lon]) / 1000
        var scoreRound = 500-distance/2;
        if (scoreRound < 0)
            scoreRound = 0;
        score += Math.round(scoreRound);

        var lineCoord = [[guess.lat, guess.lng], [loc.lat, loc.lon]];
        polyline = L.polyline(lineCoord, {color: 'red'}).addTo(map);
        markerLoc = L.circleMarker([loc.lat, loc.lon]);
        markerLoc.addTo(map);

        var zoom;
        if (distance > 20)
        {
            zoom = 10;
        }
        if (distance > 60)
        {
            zoom = 7;
        }
        if (distance > 100)
        {
            zoom = 6 ;
        }
        if (distance > 500)
        {
            zoom = 5;
        }
        if (distance > 1000)
        {
            zoom = 4;
        }
        if (distance > 2000)
        {
            zoom = 3;
        }
        if (distance > 5000)
        {
            zoom = 1;
        }

        map.setView([loc.lat, loc.lon], zoom);
        if(question === 4)
        {
            //console.log(score)
            document.getElementById("nextGame").innerHTML = "Koniec gry! Twój wynik to: "+score+"\nAby rozpocząć nową grę, naciśnij przycisk 'Nowa Gra'";
            question++;
            document.getElementById("new_game").value = score
            var roundScore = document.getElementById("new_game").value
            postData("/game", { score: score }).then((data) => {
              console.log(data);
            });
            console.log(roundScore);
        }
        document.getElementById("currScore").innerHTML = "Wynik: "+score;

    }
}

function clearMap(){
        map.removeLayer(markerLoc)
        map.removeLayer(marker)
        marker = null;
        map.removeLayer(polyline)

}

function onNextClick(){
    if (question < 4){
        clearMap();
        question++;
        nextQuestion();
        map.setView([25, 0], 2);
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

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}
function onNewGame(){
    score = 0;
    question = 1;
    locGame = JSON.parse(JSON.stringify((locDict)));
    clearMap();
    nextQuestion();
    document.getElementById("nextGame").innerHTML = "";
    map.setView([25, -0], 2);

}


map.on('click', onMapClick);


async function postData(url = "", data = {}) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  }