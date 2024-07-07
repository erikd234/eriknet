const Important = {
  CardClassSelector: ".mapMarker",
  CardSelIdPrefix: "mapMarker",
  HideItClass: "hidden",
  GeoJson: {},
  Map: null,
};

export default async function init() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXJpa2QyMzQiLCJhIjoiY2x5OXNvejZpMHRsMDJrcTZ4cTdkYnk3bSJ9.a0IYDxotO_a4bGzKtl8zlQ";
  Important.Map = new mapboxgl.Map({
    style: "mapbox://styles/erikd234/clwn6awoi00v301po6lelaloe",
    container: "map",
    projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 10,
    center: [23.7, 37.98], // long lat
  });
  // an alias for this function scope
  let map = Important.Map;
  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();

  map.on("zoomend", handleZoomEvent);

  try {
    Important.GeoJson = await fetchGeoJSON();
  } catch (err) {
    console.log(err);
  }
  for (const [i, feature] of Important.GeoJson.features.entries()) {
    // create a HTML element for each feature
    const el = createCardDivContainer(i);
    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
  }
}

function handleZoomEvent() {
  console.log(Important.GeoJson);
  const currentZoom = Important.Map.style.z;
  const elems = document.querySelectorAll(Important.CardClassSelector);
  if (currentZoom <= 8.5) {
    for (const elem of elems) {
      elem.classList.add(Important.HideItClass);
    }
  } else {
    for (const elem of elems) {
      elem.classList.remove(Important.HideItClass);
    }
  }
}

function createCardDivContainer(id) {
  const cardSkeleton = document.querySelector(Important.CardClassSelector);
  cardSkeleton.id = Important.CardSelIdPrefix + id;
  const clone = cardSkeleton.cloneNode(true);
  return clone;
}

async function fetchGeoJSON() {
  try {
    const response = await fetch("/sleepspots.geojson");
    const geojson = await response.json();
    return geojson;
  } catch (error) {
    console.error("Error fetching the GeoJSON:", error);
    return {
      type: "FeatureCollection",
      features: [{}],
    };
  }
}
