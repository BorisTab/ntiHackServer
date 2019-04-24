let map;
const markers = [];
const routes = [];
let lastData = {};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.73, lng: 37.66},
    zoom: 5,
    disableDefaultUI: true,
  });
}

$(document).ready(() => {
  $('#coordinates').submit((e) => {
    e.preventDefault();
    const ne = $('#rightUp').val();
    const sw = $('#leftBottom').val();
    [north, east] = ne.split(';');
    [south, west] = sw.split(';');
    const deltaLng = east - west;
    const deltaLat = north - south;
    const numberOfSquareLng = Math.ceil(
        deltaLng / (0.008*Math.cos(Math.PI/180 * +north)));
    const numberOfSquareLat = Math.ceil(deltaLat / 0.008);
    let squareWest = west;

    for (let squareLng = 0; squareLng < numberOfSquareLng; squareLng++) {
      south = +north + (0.008*Math.cos(Math.PI/180 * +north));
      squareWest = west;
      for (let squareLat = 0; squareLat <= numberOfSquareLat; squareLat++) {
        east = +squareWest + 0.008;
        const bounds = {
          north: +north,
          south: south,
          east: +east,
          west: squareWest,
        };
        const square = new google.maps.Rectangle({
          strokeColor: '#000000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#000000',
          fillOpacity: 0.2,
          bounds: bounds,
        });
        square.setMap(map);
        squareWest = +squareWest + 0.008;
      }
      north = +north + (0.008*Math.cos(Math.PI/180 * +north));
    }
  });

  $.ajax({
    type: 'POST',
    url: '/map/update/',
  }).done((data) => {
    const users = data.message.users;
    const markups = data.message.markups;
    users.map((item) => {
      const itemId = users.indexOf(item);
      addMarker(item.coordinates, item.color, item.infobox, itemId);
      addRoute(item.route, item.color, itemId);
    });
    markups.map((item) => {
      addMarkup(item.coordinates, item.infobox);
    });
    lastData = data.message;
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

let switchCheck = true;
$(document).on('click', '.switch-for', () => {
  if (switchCheck) {
    switchCheck = false;
    routes.map((route) => {
      route.setMap(null);
    });
  } else {
    switchCheck = true;
    lastData.users.map((user) => {
      const itemId = lastData.users.indexOf(user);
      addRoute(user.route, user.color, itemId);
    });
  }
});
const getData = () => {
  $.ajax({
    type: 'GET',
    url: '/map/update/',
  }).done((data) => {
    const users = data.message.users;
    const markups = data.message.markups;
    users.map((item) => {
      const itemId = users.indexOf(item);
      if (lastData.users[itemId].coordinates.lat !== item.coordinates.lat ||
        lastData.users[itemId].coordinates.lng !== item.coordinates.lng) {
        clearMarker(itemId);
        clearRoutes(itemId);
        addMarker(item.coordinates, item.color, item.infobox, itemId);
        addRoute(item.route, item.color, itemId);
      }
    });
    markups.map((item) => {
      addMarkup(item.coordinates, item.infobox);
    });
    lastData = data.message;
  });
};
