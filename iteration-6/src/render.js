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
import { brickColour, COLOURS } from "./palette.js";

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
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawLogo(ctx, logo, 88, 720);

  ctx.fillStyle = COLOURS.ink;
  ctx.textAlign = "center";
  ctx.font = "22px 'Segoe UI', sans-serif";
  ctx.fillText("ITERATION 6 — COLOUR AND SOUND", WIDTH / 2, 430);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText("Neon bricks. Synthesised hits. No sample files.", WIDTH / 2, 478);
  ctx.fillText("Press Space or Enter to begin", WIDTH / 2, 508);
}

function drawWalls(ctx) {
  ctx.fillStyle = COLOURS.wall;
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
  ctx.fillStyle = COLOURS.hud;
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
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText(hudHint(game), WIDTH / 2, HUD_HEIGHT - 18);
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
  ctx.fillStyle = COLOURS.paddle;
  ctx.shadowColor = COLOURS.paddle;
  ctx.shadowBlur = 12;
  ctx.fillRect(box.left, box.top, paddle.width, paddle.height);
  ctx.shadowBlur = 0;
}

function drawBall(ctx, ball) {
  ctx.fillStyle = COLOURS.ball;
  ctx.shadowColor = "#ff6ad5";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawBricks(ctx, bricks) {
  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }
    ctx.fillStyle = brickColour(brick);
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  }
}

function drawPlayfield(ctx, game) {
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawHud(ctx, game);
  drawWalls(ctx);
  drawBricks(ctx, game.bricks);
  drawPaddle(ctx, game.paddle);
  drawBall(ctx, game.ball);
}

function drawOverlay(ctx, game) {
  ctx.fillStyle = COLOURS.overlay;
  ctx.fillRect(0, HUD_HEIGHT, WIDTH, HEIGHT - HUD_HEIGHT);
  ctx.fillStyle = COLOURS.ink;
  ctx.textAlign = "center";
  ctx.font = "36px 'Segoe UI', sans-serif";
  ctx.fillText(game.state === STATES.GAME_OVER ? "GAME OVER" : "LEVEL CLEARED", WIDTH / 2, HEIGHT / 2);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText(
    game.state === STATES.GAME_OVER
      ? "Press Space or Escape for the title screen"
      : "Press Space for the next level",
    WIDTH / 2,
    HEIGHT / 2 + 36
  );
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
        drawOverlay(ctx, game);
      }
    }
  };
}
