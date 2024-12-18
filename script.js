// Initialize the map and set the zoom level to 2 for a more zoomed-out view
var map = L.map("map").setView([51.505, -0.09], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
