const planetWrapper = document.querySelector(".planet-wrapper");
const planets = document.querySelectorAll(".planet");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");

let position = 0;
const scrollSpeed = 2;
const containerWidth = 350;

// Update planet scrolling logic
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

// Fetch ISS data and update position on all planets
const fetchISSData = async () => {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );
    const data = await response.json();

    const { latitude, longitude } = data;

    // Update the latitude and longitude display
    latitudeElement.textContent = latitude.toFixed(2);
    longitudeElement.textContent = longitude.toFixed(2);

    // Calculate normalized coordinates
    const normalizedLat = (latitude + 90) / 180; // Normalize latitude (-90 to 90) to 0-1
    const normalizedLng = (longitude + 180) / 360; // Normalize longitude (-180 to 180) to 0-1

    planets.forEach((planet) => {
      // Ensure each planet has a marker
      let marker = planet.querySelector(".iss-marker");
      if (!marker) {
        marker = document.createElement("div");
        marker.classList.add("iss-marker");
        marker.innerHTML = "<span>ISS</span>";
        planet.appendChild(marker);
      }

      // Get dimensions of the planet
      const planetWidth = planet.offsetWidth;
      const planetHeight = planet.offsetHeight;

      // Calculate x and y position for the marker
      const x = normalizedLng * planetWidth;
      const y = (1 - normalizedLat) * planetHeight;

      // Update marker position
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
    });
  } catch (error) {
    console.error("Error fetching ISS data:", error);
  }
};

// Fetch ISS data every second
setInterval(fetchISSData, 1000);
