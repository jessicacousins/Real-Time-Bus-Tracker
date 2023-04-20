window.initMap = initMap;

let map;
let markers = [];

async function run() {
  const locations = await getBusLocations();
  console.log(new Date());
  console.log(locations);

  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: {
        lat: location.attributes.latitude,
        lng: location.attributes.longitude,
      },
      map: map,
      icon: {
        url: "blue.png",
        scaledSize: new google.maps.Size(30, 30),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div class="bus-info"><div>${location.attributes.label}</div><div>${location.relationships.trip.data.id}</div></div>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  });
  setTimeout(run, 15000);
}

async function getBusLocations() {
  const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.3601, lng: -71.0589 },
    zoom: 13.5,
    mapId: "d5cfa5371a5bfe75",
  });

  run();
}
