export const mapContainer = document.getElementById("map-container");
const theBody = document.getElementById("theBody");
const form = document.createElement("form");
let query;
form.classList.add("search-form");
form.setAttribute("autocomplete", "off");
theBody.appendChild(form);
export let lat = 38.8048;
export let long = -77.0469;
export let view = 15;
let searchInput = "";
import { showPlaces } from "./main2";
//create Leaflet map container
export const map = L.map("map-container", {
  minZoom: 15,
}).setView([lat, long], view);
export const clickedLayerGroup = L.layerGroup().addTo(map);
export const currentMarkers = [];
export let clickedData = {};
import { theSearchInput } from "./main3";


// OSM basemap layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// import { apiKey } from "./config";
// import { vectorBasemapLayer } from "esri-leaflet-vector";
// vectorBasemapLayer("OSM:Standard", {
//   apiKey: apiKey,
// }).addTo(map);

//Nominatim Results
query = "[38.8048, -77.0469]";
queryResults(query);
function queryResults(query) {
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=hotel+in+${query}`
  )
    .then((res) => res.json())
    .then((jResult) => {
      lat = jResult[0].lat;
      long = jResult[0].lon;
      showThePlaces(jResult);
    });
}

// SEARCH FIELD
function handleSearch() {
  searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Enter address, city or zip code");
  searchInput.setAttribute("id", "search");
  form.appendChild(searchInput);
  let button = document.createElement("button");
  button.setAttribute("id", "search-button");
  button.classList.add("btn", "btn-primary");
  button.innerHTML = "Search";
  form.appendChild(button);
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = searchInput.value;
    queryResults(input);
  });
  document
    .getElementById("search-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const input = searchInput.value;
      queryResults(input);
    });
}
handleSearch();



function showThePlaces(jResult) {
  for (const marker of currentMarkers) {
    map.removeLayer(marker);
  }
  map.setView([lat, long], view);
  for (const result of jResult) {
    console.log(result);
    let hotel = result.display_name;
    let comma = hotel.indexOf(",");
    let hotelAdd = hotel.substring(comma + 1);
    let comma2 = hotel.indexOf(",", comma + 1);
    let comma3 = hotel.indexOf(",", comma2 + 1);
    let comma4 = hotel.indexOf(",", comma3 + 1);
    let hotelAddLine1 = hotel.substring(comma + 1, comma4);
    let hotelAddLine2 = hotel.substring(comma4 + 1);
    const position = new L.LatLng(result.lat, result.lon);
    currentMarkers.push(
      new L.marker(position).addTo(map).bindTooltip(() => {
        return L.Util.template(
          `<div style="background:#EBECF0; border:solid 1px #BEBEBE; border-radius:3px; padding:10px;font-size:14px;">
          <b>${hotel.substring(0, hotel.indexOf(","))}</b>
          <br/>${hotelAddLine1}
          <br/>${hotelAddLine2}</div>`
        );
      })
    );
  }
}

if (searchInput == "") {
  theSearchInput.addTo(map);
}

// //handle getting results
if (!query) {
  const results = L.layerGroup().addTo(map);
  theSearchInput.on("results", (data) => {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
      const lat = data.results[i].latlng.lat;
      const long = data.results[i].latlng.lng;
      map.setView(new L.LatLng(lat, long), view);
    }
    showPlaces();
  });
  showPlaces();
}
