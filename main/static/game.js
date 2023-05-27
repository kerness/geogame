var map = L.map('map').setView([51.505, -0.09], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker;
var guess;
var markerLoc;
var loc = [52.0, -1]
var polyline;
var distance;
var question = 0

function resMap(loc, zoom) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}

function onMapClick(e) {
    if (!marker)
    {
        marker = L.marker(e.latlng);
        guess = e.latlng
        marker.addTo(map);
    }
    else
    {
        marker.setLatLng(e.latlng);
        guess = [e.lat,e.lng];
    }
}
function onSubmitClick() {
    if (marker)
    {
        distance = getDistance([guess.lat,guess.lng],[loc[0],loc[1]])/1000
        console.log(distance)
        console.log(guess.lat +" "+ guess.lng)
        var lineCoord = [[guess.lat,guess.lng],[loc[0],loc[1]]];
        polyline = L.polyline(lineCoord, {color:'red'}).addTo(map);
        markerLoc = L.marker([loc[0],loc[1]]);
        markerLoc.addTo(map);
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




map.on('click', onMapClick);