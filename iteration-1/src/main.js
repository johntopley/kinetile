import { HEIGHT, MAX_FRAME_DT, WIDTH } from "./constants.js";
import { advance, createGame } from "./game.js";
import { createRenderer } from "./render.js";

function fitCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(WIDTH * dpr);
  canvas.height = Math.round(HEIGHT * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

async function boot() {
  const canvas = document.getElementById("game");
  const logo = await loadImage("./assets/kinetile-logo.jpg");
  const game = createGame();
  const renderer = createRenderer(canvas, { logo });

  fitCanvas(canvas);
  window.addEventListener("resize", () => fitCanvas(canvas));

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
      event.preventDefault();
    }
    game.input.press(event.code);
  });
  window.addEventListener("keyup", (event) => {
    game.input.release(event.code);
  });

  let previous = performance.now();

  function frame(now) {
    const elapsed = Math.min((now - previous) / 1000, MAX_FRAME_DT);
    previous = now;
    advance(game, elapsed);
    renderer.draw(game);
    requestAnimationFrame(frame);
  }

  renderer.draw(game);
  requestAnimationFrame(frame);
}

boot();
