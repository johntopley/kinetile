import {
  HEIGHT,
  HUD_HEIGHT,
  ITERATION,
  MONOCHROME,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  PLAYFIELD_TOP,
  STATES,
  WALL_THICKNESS,
  WIDTH
} from "./constants.js";
import { paddleBounds } from "./paddle.js";

const INK = "#f4f7fb";
const VOID = "#000000";

function drawLogo(ctx, logo, y, maxWidth) {
  if (!logo || !logo.complete || logo.naturalWidth === 0) {
    return;
  }

  const scale = Math.min(1, maxWidth / logo.naturalWidth);
  const width = logo.naturalWidth * scale;
  const height = logo.naturalHeight * scale;
  const x = (WIDTH - width) / 2;

  ctx.save();
  if (MONOCHROME) {
    ctx.filter = "grayscale(1) contrast(1.15)";
  }
  ctx.drawImage(logo, x, y, width, height);
  ctx.restore();
}

function drawTitle(ctx, logo) {
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawLogo(ctx, logo, 88, 720);

  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = "22px 'Segoe UI', sans-serif";
  ctx.fillText("ITERATION 1 — THE BAT", WIDTH / 2, 430);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillText("A and D or the arrow keys move the bat", WIDTH / 2, 478);
  ctx.fillText("Press Space or Enter to begin", WIDTH / 2, 508);
}

function drawWalls(ctx) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, PLAYFIELD_TOP, WALL_THICKNESS, HEIGHT - PLAYFIELD_TOP);
  ctx.fillRect(
    WIDTH - WALL_THICKNESS,
    PLAYFIELD_TOP,
    WALL_THICKNESS,
    HEIGHT - PLAYFIELD_TOP
  );
  ctx.fillRect(0, PLAYFIELD_TOP, WIDTH, WALL_THICKNESS);
}

function drawHud(ctx) {
  ctx.fillStyle = INK;
  ctx.font = "16px 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KINETILE", 20, 36);
  ctx.textAlign = "right";
  ctx.fillText(`ITERATION ${ITERATION}`, WIDTH - 20, 36);
  ctx.textAlign = "center";
  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillText("Move the bat. The ball arrives in the next iteration.", WIDTH / 2, HUD_HEIGHT - 18);
}

function drawPaddle(ctx, paddle) {
  const box = paddleBounds(paddle);
  ctx.fillStyle = INK;
  ctx.fillRect(box.left, box.top, paddle.width, paddle.height);
}

function drawPlayfield(ctx, game) {
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawHud(ctx);
  drawWalls(ctx);
  drawPaddle(ctx, game.paddle);

  ctx.strokeStyle = INK;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(PLAYFIELD_LEFT, game.paddle.y);
  ctx.lineTo(PLAYFIELD_RIGHT, game.paddle.y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function createRenderer(canvas, assets) {
  const ctx = canvas.getContext("2d");

  return {
    draw(game) {
      ctx.imageSmoothingEnabled = true;
      ctx.textBaseline = "alphabetic";
      if (game.state === STATES.TITLE) {
        drawTitle(ctx, assets.logo);
        return;
      }
      drawPlayfield(ctx, game);
    }
  };
}
