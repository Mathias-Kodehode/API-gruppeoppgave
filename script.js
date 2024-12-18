const planetWrapper = document.querySelector(".planet-wrapper");

let position = 0;
const scrollSpeed = 2;
const containerWidth = 350;

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    position -= scrollSpeed;
  } else if (event.key === "ArrowLeft") {
    position += scrollSpeed;
  }

  if (position <= -containerWidth) {
    position = 0;
  } else if (position >= containerWidth) {
    position = 0;
  }

  planetWrapper.style.transform = `translateX(${position}px)`;
});

// Initialize the map and set the zoom level to 2 for a more zoomed-out view
var map = L.map("map").setView([51.505, -0.09], 2); // Zoom level 2 for a world view

// Add tile layer (OpenStreetMap tiles)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
