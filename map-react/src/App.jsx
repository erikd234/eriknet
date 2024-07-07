import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import Overlay from "./components/overlay";
const mapboxgl = window.mapboxgl;
mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJpa2QyMzQiLCJhIjoiY2x5OXNvejZpMHRsMDJrcTZ4cTdkYnk3bSJ9.a0IYDxotO_a4bGzKtl8zlQ";

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

const HelloFromTheOtherSide = () => {
  return (
    <>
      <div>HelloFromTheOtherSIde</div>
    </>
  );
};

const Important = {
  CardClassSelector: ".mapMarker",
  CardSelIdPrefix: "mapMarker",
  HideItClass: "hidden",
  GeoJson: {},
  Map: null,
};

function createCardDivContainer(id) {
  const cardSkeleton = document.querySelector(Important.CardClassSelector);
  cardSkeleton.id = Important.CardSelIdPrefix + id;
  const clone = cardSkeleton.cloneNode(true);
  return clone;
}

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const portalDiv = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      style: "mapbox://styles/erikd234/clwn6awoi00v301po6lelaloe",
      container: "map",
      projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
      zoom: 10,
      center: [23.7, 37.98], // long lat
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    fetchGeoJSON().then((geojson) => {
      console.log(geojson);
      for (const [i, feature] of geojson.features.entries()) {
        // create a HTML element for each feature
        // make a marker for each feature and add it to the map
        const newDiv = createCardDivContainer(i);
        new mapboxgl.Marker(newDiv)
          .setLngLat(feature.geometry.coordinates)
          .addTo(map.current);
      }
      portalDiv.current = document.getElementById("mapMarker1");
      setLoaded(true);
    });
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 w-full h-full">
        <Overlay />
        <div id="map" ref={mapContainer} className="w-full h-full" />
      </div>
      {loaded == true
        ? createPortal(<HelloFromTheOtherSide />, portalDiv.current)
        : ""}
    </>
  );
}

export default App;
