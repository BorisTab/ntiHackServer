let map;
let markers = [];
let routes = [];
let lastData = {};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.73, lng: 37.66},
    zoom: 5,
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
  // addMarker();
  // addRoute();
  // addMarkup();
  $.ajax({
    type: 'POST',
    url: '/map/update/',
  }).done((data) => {
    console.log(data.users);
    const users = data.users;
    const markups = data.markups;
    users.map((item) => {
      const itemId = users.indexOf(item);
      addMarker(item.coordinates, item.color, item.infobox, itemId);
      addRoute(item.route, item.color, itemId);
    });
    markups.map((item) => {
      addMarkup(item.coordinates, item.infobox);
    });
    lastData = data;
  });
  setInterval(getData, 3000);
});

function addMarker(
    coordinates = {lat: 55.73, lng: 37.66},
    color = 'e40076',
    info = 'Lorem Ipsum',
    id) {
  const icon = {
    url: `../static/assets/icons/${color}.png`,
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
  id < markers.length ? markers[id] = marker : markers.push(marker);
}

function addRoute(
    route = [
      {lat: 55.73, lng: 37.66},
      {lat: 55.75, lng: 37.62},
    ],
    color = 'e40076',
    id) {
  const line = new google.maps.Polyline({
    path: route,
    strokeColor: `#${color}`,
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });
  line.setMap(map);
  id < routes.length ? routes[id] = line : routes.push(line);
}

function clearMarker(id) {
  markers[id].setMap(null);
}

function clearRoutes(id) {
  console.log(routes[id]);
  routes[id].setMap(null);
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
    url: '/map/update/',
  }).done((data) => {
    console.log(data.users);
    const users = data.users;
    const markups = data.markups;
    users.map((item) => {
      const itemId = users.indexOf(item);
      if (lastData.users[itemId].coordinates.lat !== item.coordinates.lat ||
          lastData.users[itemId].coordinates.lng !== item.coordinates.lng) {
        console.log(lastData);
        console.log(markers);
        clearMarker(itemId);
        clearRoutes(itemId);
        addMarker(item.coordinates, item.color, item.infobox, itemId);
        addRoute(item.route, item.color, itemId);
      }
    });
    markups.map((item) => {
      addMarkup(item.coordinates, item.infobox);
    });
    lastData = data;
  });
};
