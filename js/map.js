// Initialize the map
const map = L.map("map").setView([0, 0], 2); // Start centered at 0,0 with zoom level 2

// Add a tile layer to the map (OpenStreetMap tiles)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

// Create a custom icon with a Google Maps-style location pin
const locationPinIcon = L.divIcon({
  className: "location-pin-icon",
  html: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="red">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
    </svg>
  `,
  iconSize: [40, 40], // Size of the pin
  iconAnchor: [20, 40], // Adjust anchor point to the bottom center of the pin
});

// Add the ISS marker to the map
let issMarker = L.marker([0, 0], { icon: locationPinIcon }).addTo(map);

// Fetch ISS position and update the marker
async function updateISSPosition() {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );
    const data = await response.json();

    const { latitude, longitude } = data;

    // Update the marker position
    issMarker.setLatLng([latitude, longitude]);

    // Center the map on the ISS
    map.setView([latitude, longitude], map.getZoom());
  } catch (error) {
    console.error("Error updating ISS position:", error);
  }
}

// Update ISS position every 5 seconds
setInterval(updateISSPosition, 5000);
