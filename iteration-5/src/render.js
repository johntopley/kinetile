import {
  HEIGHT,
  HUD_HEIGHT,
  INITIAL_LIVES,
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
  ctx.fillText("ITERATION 5 — LEVELS", WIDTH / 2, 430);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillText("Each level is a new seeded formation.", WIDTH / 2, 478);
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
  ctx.fillText(`LEVEL ${game.level}   ·   ITERATION ${ITERATION}`, WIDTH - 20, 36);
  ctx.textAlign = "center";
  ctx.fillText(
    `LIVES  ${"●".repeat(game.lives)}${"○".repeat(Math.max(0, INITIAL_LIVES - game.lives))}`,
    WIDTH / 2,
    36
  );
  ctx.font = "14px 'Segoe UI', sans-serif";
  const hint = hudHint(game);
  ctx.fillText(hint, WIDTH / 2, HUD_HEIGHT - 18);
}

function hudHint(game) {
  if (game.state === STATES.SERVE) {
    return "Press Space to serve";
  }
  if (game.state === STATES.LIFE_LOST) {
    return "Life lost — press Space to continue";
  }
  if (game.state === STATES.GAME_OVER) {
    return "Game over — press Space to return to the title";
  }
  if (game.state === STATES.LEVEL_CLEAR) {
    return "Level cleared — press Space for the next formation";
  }
  return "Break every brick";
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

function drawBricks(ctx, bricks) {
  ctx.fillStyle = INK;
  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  }
}

function drawPlayfield(ctx, game) {
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawHud(ctx, game);
  drawWalls(ctx);
  drawBricks(ctx, game.bricks);
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
      if (game.state === STATES.GAME_OVER || game.state === STATES.LEVEL_CLEAR) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, HUD_HEIGHT, WIDTH, HEIGHT - HUD_HEIGHT);
        ctx.fillStyle = INK;
        ctx.textAlign = "center";
        ctx.font = "36px 'Segoe UI', sans-serif";
        ctx.fillText(game.state === STATES.GAME_OVER ? "GAME OVER" : "LEVEL CLEARED", WIDTH / 2, HEIGHT / 2);
        ctx.font = "18px 'Segoe UI', sans-serif";
        ctx.fillText(
          game.state === STATES.GAME_OVER
            ? "Press Space or Escape for the title screen"
            : "Press Space for the next level",
          WIDTH / 2,
          HEIGHT / 2 + 36
        );
      }
    }
  };
}
