let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.73, lng: 37.66},
    zoom: 13,
    disableDefaultUI: true,
  });

  const bounds = {
    north: 55.75,
    south: 55.72,
    east: 37.70,
    west: 37.65,
  };

  // rectangle = new google.maps.Rectangle({
  //   bounds: bounds,
  //   editable: false,
  //   draggable: false,
  // });

  // rectangle.setMap(map);
}

$(document).ready(() => {
  $('#coordinateSend').click(() => {
    const ne = $('#rightUp').val();
    const sw = $('#leftBottom').val();
    console.log('aaa');

    // const newBounds = {
    //   north: rightUpLat,
    //   south: leftDownLat,
    //   east: rightUpLng,
    //   west: leftDownLng,
    // };
  });
//  addMarker();
//  addRoute();
//  addMarkup();

setInterval(getData, 3000);
});

function addMarker(
    coordinates = {lat: 55.73, lng: 37.66},
    color = 'e40076',
    info = 'Lorem Ipsum') {
  const icon = {
    url: `../static/assets/icons/${color}.png`,
//    size: new google.maps.Size(30, 30),
    anchor: new google.maps.Point(15, 15),
  };
  const marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    icon: icon,
  });

  const infoBox = new google.maps.InfoWindow({
    content: `<div class="infoBox">${info}</div>`,
  });
  marker.addListener('click', () => infoBox.open(map, marker));
}

function addRoute(
    route = [
      {lat: 55.73, lng: 37.66},
      {lat: 55.75, lng: 37.62},
    ],
    color = 'e40076') {
  const line = new google.maps.Polyline({
    path: route,
    strokeColor: `#${color}`,
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });
  line.setMap(map);
}

function addMarkup(
    coordinates = {lat: 55.71, lng: 37.63},
    info = 'Lorem Ipsum') {
  const marker = new google.maps.Marker({
    position: coordinates,
    map: map,
  });

  const infoBox = new google.maps.InfoWindow({
    content: `<div class="infoBox">${info}</div>`,
  });
  marker.addListener('click', () => infoBox.open(map, marker));
}

const getData = () => {
  $.ajax({
  type: 'POST',
  url: '/front_update/',
}).done((data) => {
  console.log(data.users);
  const users = data.users;
  const markups = data.markups;
  users.map((item) => {
    addMarker(item.coordinates, item.color, item.infobox);
    addRoute(item.route, item.color);
  });
  markups.map((item) => {
    addMarkup(item.coordinates, item.infobox);
  });
});
}
