const planetWrapper = document.querySelector(".planet-wrapper");
const planets = document.querySelectorAll(".planet");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");

let position = 0;
const scrollSpeed = 2;
const containerWidth = 350;

// Function to fetch ISS position
async function fetchISSPosition() {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );
    const data = await response.json();

    const latitude = parseFloat(data.latitude);
    const longitude = parseFloat(data.longitude);

    // Update the UI with the new latitude and longitude
    latitudeElement.textContent = `Latitude: ${latitude.toFixed(2)}`;
    longitudeElement.textContent = `Longitude: ${longitude.toFixed(2)}`;

    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching ISS position:", error);
    return null;
  }
}

// Function to update ISS position on planets
async function updateISSOnPlanets() {
  const issData = await fetchISSPosition();
  if (!issData) return;

  const { latitude, longitude } = issData;

  // Normalize latitude and longitude
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
}

// Handle horizontal scrolling with arrow keys
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    position -= scrollSpeed;
    console.log(position);
  } else if (event.key === "ArrowLeft") {
    position += scrollSpeed;
    console.log(position);
  }

  if (position <= -containerWidth) {
    position = 0;
  } else if (position >= containerWidth - 50) {
    position = -50;
  }

  planetWrapper.style.transform = `translateX(${position}px)`;
});

// Fetch ISS data and update position on all planets every second
setInterval(updateISSOnPlanets, 1000);
