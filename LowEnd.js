const planetWrapper = document.querySelector(".planet-wrapper");

let position = 0;
const scrollSpeed = 2;
const containerWidth = 350;

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
