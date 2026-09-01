import {
  HEIGHT,
  HUD_HEIGHT,
  ITERATION,
  MONOCHROME,
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
  ctx.fillText("ITERATION 2 — THE BALL", WIDTH / 2, 430);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillText("Space serves. The bat steers the rebound.", WIDTH / 2, 478);
  ctx.fillText("Press Space or Enter to begin", WIDTH / 2, 508);
}

function drawWalls(ctx) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, HUD_HEIGHT, WALL_THICKNESS, HEIGHT - HUD_HEIGHT);
  ctx.fillRect(
    WIDTH - WALL_THICKNESS,
    HUD_HEIGHT,
    WALL_THICKNESS,
    HEIGHT - HUD_HEIGHT
  );
  ctx.fillRect(0, HUD_HEIGHT, WIDTH, WALL_THICKNESS);
}

function drawHud(ctx, game) {
  ctx.fillStyle = INK;
  ctx.font = "16px 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KINETILE", 20, 36);
  ctx.textAlign = "right";
  ctx.fillText(`ITERATION ${ITERATION}`, WIDTH - 20, 36);
  ctx.textAlign = "center";
  ctx.font = "14px 'Segoe UI', sans-serif";
  const hint = game.state === STATES.SERVE
    ? "Press Space to serve"
    : "Hit the ball with the edge of the bat to steer it";
  ctx.fillText(hint, WIDTH / 2, HUD_HEIGHT - 18);
}

function drawPaddle(ctx, paddle) {
  const box = paddleBounds(paddle);
  ctx.fillStyle = INK;
  ctx.fillRect(box.left, box.top, paddle.width, paddle.height);
}

function drawBall(ctx, ball) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayfield(ctx, game) {
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawHud(ctx, game);
  drawWalls(ctx);
  drawPaddle(ctx, game.paddle);
  drawBall(ctx, game.ball);
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
