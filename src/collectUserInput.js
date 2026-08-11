import { queueMove } from "./components/Player";

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault(); // Avoid scrolling the page
    queueMove("forward");
  } else if (event.key === "ArrowDown") {
    event.preventDefault(); // Avoid scrolling the page
    queueMove("backward");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault(); // Avoid scrolling the page
    queueMove("left");
  } else if (event.key === "ArrowRight") {
    event.preventDefault(); // Avoid scrolling the page
    queueMove("right");
  }
});
