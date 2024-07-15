import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

const CARDS_TO_LOAD = 5;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // Map state
  const portalDiv = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [loaded, setLoaded] = useState(false);

  // overlay state
  // this is starting at 0and goes to zero
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedId = selectedIndex + 1;
  const [selIframeSrc, setSelIframeSrc] = useState("1.html");
  const [iFrameView, setIFrameView] = useState(false);
  const scrollingElementRef = useRef(null);
  const blogCardRefs = useRef([]);
  const [posts, setPosts] = useState([]);

  const fetchManifest = async () => {
    try {
      const response = await axios.get("/manifest.json");
      const manifest = response.data.manifest;
      const newPosts = manifest.slice(0, CARDS_TO_LOAD);
      console.log("newPosts:", newPosts);
      setPosts([...newPosts]);
    } catch (error) {
      console.error("Error fetching the manifest:", error);
    }
  };
  useEffect(() => {
    fetchManifest();
  }, []);

  const centerElementInScrollContainer = (container, element) => {
    const containerHeight = container.clientHeight;
    const elementHeight = element.clientHeight;
    const elementOffsetTop = element.offsetTop;

    const scrollPosition =
      elementOffsetTop - containerHeight / 2 + elementHeight / 2;
    const maxScrollTop = container.scrollHeight - containerHeight;
    const minScrollTop = 0;

    if (scrollPosition < minScrollTop) {
      container.scrollTop = minScrollTop;
    } else if (scrollPosition > maxScrollTop) {
      container.scrollTop = maxScrollTop;
    } else {
      container.scrollTop = scrollPosition;
    }
  };

  const setSelectedIdFromPostId = (postId) => {
    setSelectedIndex(postId - 1);
  };

  const handleSelection = (e, selectedPostId, iframeSource) => {
    setSelIframeSrc(iframeSource);
    setIFrameView(true);
    // adding a little timeout makes the UI look cleaner
    const element = e.currentTarget;
    const container = scrollingElementRef.current;
    centerElementInScrollContainer(container, element);
    setTimeout(() => {
      setSelectedIdFromPostId(selectedPostId);
    }, 100);
  };

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

  const handlePrevClick = () => {
    if (iFrameView == true) {
      handleOverlayPrevClick();
    }
    const nextContainerIndex = selectedIndex - 1;
    if (nextContainerIndex < 0) {
      return;
    }
    setSelectedIndex(nextContainerIndex);
    const nextDivToCenter = blogCardRefs.current[nextContainerIndex];
    centerElementInScrollContainer(
      scrollingElementRef.current,
      nextDivToCenter
    );
  };

  const handleNextClick = () => {
    if (iFrameView == true) {
      handleOverlayNextClick();
    }
    const nextContainerIndex = selectedIndex + 1;
    if (nextContainerIndex == blogCardRefs.current.length) {
      return;
    }
    setSelectedIndex(nextContainerIndex);
    const nextDivToCenter = blogCardRefs.current[nextContainerIndex];
    centerElementInScrollContainer(
      scrollingElementRef.current,
      nextDivToCenter
    );
  };

  const handleOverlayNextClick = () => {
    if (!selectedIndex) {
      setSelectedIndex(0);
    }
    const nextPostIndex = selectedIndex + 1;
    if (nextPostIndex == blogCardRefs.current.length) {
      return;
    }
    setSelIframeSrc(posts[nextPostIndex].htmlPath);
    setSelectedIndex(nextPostIndex);
  };

  const handleOverlayPrevClick = () => {
    if (!selectedIndex) {
      setSelectedIndex(0);
    }
    const prevPostIndex = selectedIndex - 1;
    if (prevPostIndex < 0) {
      return;
    }
    setSelIframeSrc(posts[prevPostIndex].htmlPath);
    setSelectedIndex(prevPostIndex);
  };
  const handleIFrameClose = () => {
    setIFrameView(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 w-full h-full">
        <Overlay
          ref={scrollingElementRef}
          selectedId={selectedId}
          onSelection={handleSelection}
          selIframeSrc={selIframeSrc}
          isIFrameView={iFrameView}
          onPrevClick={handleOverlayPrevClick}
          onNextClick={handleOverlayNextClick}
          onIFrameClose={handleIFrameClose}
          blogCardRefs={blogCardRefs}
          posts={posts}
        />
        <div className="relative">
          <button
            className={
              "absolute top-1/2 z-50 right-0" +
              (selectedIndex == blogCardRefs.current.length - 1
                ? " hidden"
                : "")
            }
            onClick={handleNextClick}
          >
            Next
          </button>
          <button
            className={
              "absolute top-1/2 z-50" + (selectedIndex == 0 ? " hidden" : "")
            }
            onClick={handlePrevClick}
          >
            Prev
          </button>
          <div id="map" ref={mapContainer} className="w-full h-full" />
        </div>
      </div>
      {loaded == true
        ? createPortal(<HelloFromTheOtherSide />, portalDiv.current)
        : ""}
    </>
  );
}

export default App;
