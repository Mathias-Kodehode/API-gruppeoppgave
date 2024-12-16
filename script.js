// Select the planet wrapper
const planetWrapper = document.querySelector(".planet-wrapper");

// Variables for scrolling logic
let position = 0; // Initial scroll position
const scrollSpeed = 2; // Speed of scrolling in pixels per frame
const containerWidth = 300; // Width of the planet-container

// Event listener for arrow key presses
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    position -= scrollSpeed; // Move left for "right rotation"
  } else if (event.key === "ArrowLeft") {
    position += scrollSpeed; // Move right for "left rotation"
  }

  // Looping logic: reset position when it crosses boundaries
  if (position <= -containerWidth) {
    position = 0; // Reset when scrolled past left duplicate
  } else if (position >= containerWidth) {
    position = 0; // Reset when scrolled past right duplicate
  }

  // Apply the translation
  planetWrapper.style.transform = `translateX(${position}px)`;
});
