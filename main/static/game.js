var map = L.map('map').setView([51.505, -0.09], 1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker;
var guess;
var markerLoc;
const locDict ={
  location:
      [{  name: "Wielka Brytania",
          lat : 52.0,
          lon : -1.0},
      {  name: "Niemcy",
          lat : 51.17,
          lon : 10.0},
      {  name: "Polska",
          lat : 51.91,
          lon : 19.13},
      {  name: "Czechy",
          lat : 49.8,
          lon : 15.47},
      {  name: "Włochy",
          lat : 41.29,
          lon : 12.57},
      {  name: "Brazylia",
          lat : -14.24,
          lon : -53.18},
      {  name: "Rosja",
          lat : 55.0,
          lon : 103.0},
      {  name: "USA",
          lat : 37.6,
          lon : -95.67},
      {  name: "Argentyna",
          lat : -38.42,
          lon : -63.6},
      {  name: "Australia",
          lat : -26.44,
          lon : 133.28}
      ]
};
var locGame = JSON.parse(JSON.stringify((locDict)));
var loc;
nextQuestion();
var polyline;
var distance;
var score = 0
var question = 1
var currPos;

function nextQuestion(){

    if(question !== 1){
        locGame.location.splice(currPos,1);
}
    min = Math.ceil(0);
    max = Math.floor(locGame.location.length-1);
    currPos = Math.floor(Math.random() * (max - min + 1)) + min;
    loc = locGame.location[currPos];
    console.log(currPos);
    console.log(loc.name);

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
        console.log(distance)
        var scoreRound = 500-distance/2;
        if (scoreRound < 0)
            scoreRound = 0;
        score += Math.round(scoreRound);
        console.log(score)


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
            console.log("Koniec gry! Wynik to: "+ score)
            console.log(score)
        }

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
    console.log(locGame.location.length);
    clearMap();
    nextQuestion();
    map.setView([51.505, -0.09], 1);

}


map.on('click', onMapClick);