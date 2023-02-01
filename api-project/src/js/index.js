import "regenerator-runtime/runtime";

import { keys } from "./keys";
import { DOMSelectors } from "./DOM";

const celciusToF = (C) => Math.round(C * (9 / 5) + 32);

async function returnFetch(entry) {
  try {
    const response = await fetch(entry);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return 1;
  }
}

async function changeBG(place) {
  let entry = `https://pixabay.com/api/?q=${place.state}&orientation=horizontal&min_width=1920&min_height=1080&editors_choice=1&category=places&key=${keys.pixabay}`;
  let answer = await returnFetch(entry);
  if (answer.hits.length === 0) {
    entry = `https://pixabay.com/api/?id=3625405&key=${keys.pixabay}`;
    answer = await returnFetch(entry);
  }

  const BG_url = answer.hits[0].largeImageURL;

  DOMSelectors.bg.style.backgroundImage = `url('${BG_url}')`;
}

function changePlaceHTML(place) {
  let cityState;
  if (place.city === place.state) {
    cityState = `${place.city}`;
  } else {
    cityState = `${place.city}, ${place.state}`;
  }

  DOMSelectors.placeCityState.innerHTML = cityState;
  DOMSelectors.placeCountry.innerHTML = place.country;
}

function changeNumHTML(temp, aqi) {
  let color;
  if (aqi <= 50) {
    color = "green";
  } else if (aqi <= 100) {
    color = "yellow";
  } else if (aqi <= 200) {
    color = "red";
  } else {
    color = "purple";
  }
  DOMSelectors.aqi.style.color = color;

  DOMSelectors.aqi.innerHTML = aqi;
  DOMSelectors.temp.innerHTML = `${temp}°C / ${celciusToF(temp)}°F`;
}

function display(temp, aqi, place) {
  changeBG(place);

  changePlaceHTML(place);

  changeNumHTML(temp, aqi);
}

async function fetchAirQuality(location = "") {
  let entry;
  if (location == undefined) {
    entry = `https://api.airvisual.com/v2/nearest_city?key=${keys.airVisual}`;
  } else {
    entry = `https://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=${location.lng}&key=${keys.airVisual}`;
  }
  const answer = await returnFetch(entry);
  const data = answer.data;

  const temp = data.current.weather.tp;
  const aqi = data.current.pollution.aqius;

  const state = data.state;
  const city = data.city;
  const country = data.country;

  display(temp, aqi, { city, state, country });
}

async function fetchLocation(query) {
  const entry = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${keys.openCage}`;

  const answer = await returnFetch(entry);
  const target = answer.results[0];

  const lat = target.geometry.lat;
  const lng = target.geometry.lng;
  fetchAirQuality({ lat, lng });
}

function init() {
  fetchAirQuality();

  DOMSelectors.userBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const query = DOMSelectors.userSearch.value;
    DOMSelectors.userSearch.value = "";
    fetchLocation(query);
  });
}
init();
