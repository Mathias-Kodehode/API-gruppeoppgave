const planetWrapper = document.querySelector(".planet-wrapper");
const planets = document.querySelectorAll(".planet");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");

let position = 0;
const scrollSpeed = 2;
const containerWidth = 350;

let fetchInterval = 5000; // Start with a 5-second interval
let backoffTimeout = null;

// Update planet scrolling logic

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
  const normalizedLat = (latitude + 90) / 180;
  const normalizedLng = (longitude + 180) / 360;

  planets.forEach((planet) => {
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
  } else if (event.key === "ArrowLeft") {
    position += scrollSpeed;
  }

  if (position <= -containerWidth) {
    position = 0;
  } else if (position >= containerWidth - 50) {
    position = -50;
  }

  planetWrapper.style.transform = `translateX(${position}px)`;
});

// Fetch ISS data and update position on all planets
const fetchISSData = async () => {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );

    if (response.status === 429) {
      console.warn("Rate limit reached. Pausing requests temporarily...");
      backoff();
      return;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const { latitude, longitude } = data;

    if (latitude === undefined || longitude === undefined) {
      throw new Error("Missing latitude or longitude in API response");
    }

    // Update the latitude and longitude display
    latitudeElement.textContent = `Latitude: ${latitude.toFixed(2)}`;
    longitudeElement.textContent = `Longitude: ${longitude.toFixed(2)}`;

    // Calculate normalized coordinates
    const normalizedLat = (latitude + 90) / 180;
    const normalizedLng = (longitude + 180) / 360;

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

    // Reset backoff interval on successful fetch
    resetBackoff();
  } catch (error) {
    console.error("Error fetching ISS data:", error);
  }
};

// Backoff mechanism for rate-limiting
const backoff = () => {
  if (backoffTimeout) {
    clearTimeout(backoffTimeout);
  }

  fetchInterval = Math.min(fetchInterval * 2, 60000);
  console.log(`Increasing fetch interval to ${fetchInterval / 1000} seconds.`);
  backoffTimeout = setTimeout(() => fetchISSData(), fetchInterval);
};

// Reset backoff to the default interval
const resetBackoff = () => {
  if (backoffTimeout) {
    clearTimeout(backoffTimeout);
  }

  fetchInterval = 5000;
};

// Fetch ISS data every interval
setInterval(fetchISSData, fetchInterval);

// Fetch ISS data and update position on all planets every second
setInterval(updateISSOnPlanets, 1000);
