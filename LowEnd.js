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
