const duck = document.getElementById("duck");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score-display");

let score = 0;
let movingUp = false; // Flag to track whether the duck is moving
let moveInterval = null; // Interval for duck's upward movement

// Set initial position of the duck at the bottom
function initializeDuck() {
  const gameAreaWidth = gameArea.clientWidth;
  const randomX = Math.random() * (gameAreaWidth - 60); // 60 is the width of the duck
  duck.style.left = `${randomX}px`;
  duck.style.bottom = `0px`; // Set the duck to the bottom of the game area
}

// Function to animate the duck upwards
function moveDuckUp() {
  let bottomPosition = 0; // Start at the bottom

  // If the duck is already moving, prevent starting a new movement
  if (movingUp) return;

  movingUp = true; // Set movingUp to true to indicate that the duck is in motion

  // Clear any previous movement interval to prevent conflicts
  if (moveInterval) {
    clearInterval(moveInterval);
  }

  // Start the interval for upward movement
  moveInterval = setInterval(() => {
    bottomPosition += 2; // Move upwards by 2px per frame
    duck.style.bottom = `${bottomPosition}px`;

    // Stop the animation when the duck reaches the top
    if (bottomPosition >= gameArea.clientHeight - 50) {
      clearInterval(moveInterval); // Stop the upward movement
      movingUp = false; // Reset the flag to allow movement again

      // Reinitialize the duck position after reaching the top
      initializeDuck();

      // After resetting, start the movement again
      moveDuckUp();
    }
  }, 20); // Update every 20ms
}

// Function to update the score
function increaseScore() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  initializeDuck(); // Reinitialize position at the bottom
}

// Add event listener to the duck for when it is clicked
duck.addEventListener("click", () => {
  increaseScore(); // Increment the score on click

  // Start the upward movement if the duck isn't already moving
  if (!movingUp) {
    moveDuckUp();
  }
});

// Initialize the game on start
initializeDuck();
moveDuckUp(); // Start the upward movement after initialization
