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
  ctx.fillText("ITERATION 9 — LASERS", WIDTH / 2, 400);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText("A magenta capsule arms the bat. Space fires twin shots.", WIDTH / 2, 432);
  ctx.fillText("Press Space or Enter to begin", WIDTH / 2, 458);
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
  ctx.fillText(`SCORE  ${game.score}`, 20, 36);
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
  if (game.state === STATES.HIGH_SCORE_ENTRY) {
    return "New high score — type a name and press Enter";
  }
  if (game.state === STATES.GAME_OVER) {
    return "Game over — press Space to return to the title";
  }
  if (game.state === STATES.LEVEL_CLEAR) {
    return "Level cleared — press Space for the next formation";
  }
  if (game.effects.laser > 0) {
    return `Lasers  ${game.effects.laser.toFixed(1)}s  ·  Space to fire`;
  }
  if (game.effects.wide > 0) {
    return `Wide bat  ${game.effects.wide.toFixed(1)}s`;
  }
  return "Catch falling capsules";
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

function drawPowerUps(ctx, powerUps) {
  ctx.font = "12px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const item of powerUps) {
    ctx.fillStyle = COLOURS.powerUps[item.type] ?? COLOURS.ink;
    ctx.beginPath();
    ctx.roundRect(item.x - item.width / 2, item.y - item.height / 2, item.width, item.height, 6);
    ctx.fill();
    ctx.fillStyle = COLOURS.background;
    ctx.fillText(item.type[0], item.x, item.y + 1);
  }
  ctx.textBaseline = "alphabetic";
}

function drawPlayfield(ctx, game) {
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawHud(ctx, game);
  drawWalls(ctx);
  drawBricks(ctx, game.bricks);
  drawPowerUps(ctx, game.powerUps);
  drawMissiles(ctx, game.missiles);
  drawPaddle(ctx, game.paddle);
  drawBall(ctx, game.ball);
}

function drawMissiles(ctx, missiles) {
  ctx.fillStyle = COLOURS.powerUps.LASER;
  for (const missile of missiles) {
    ctx.fillRect(
      missile.x - missile.width / 2,
      missile.y - missile.height / 2,
      missile.width,
      missile.height
    );
  }
}

function drawScoreTable(ctx, scores, top) {
  ctx.font = "16px 'Segoe UI', monospace";
  ctx.textAlign = "center";
  if (scores.length === 0) {
    ctx.fillStyle = COLOURS.muted;
    ctx.fillText("No high scores yet", WIDTH / 2, top);
    return;
  }
  scores.slice(0, 8).forEach((entry, index) => {
    ctx.fillStyle = COLOURS.ink;
    const rank = String(index + 1).padStart(2, " ");
    const name = entry.name.padEnd(3, " ");
    const score = String(entry.score).padStart(6, " ");
    ctx.fillText(`${rank}   ${name}   ${score}`, WIDTH / 2, top + index * 22);
  });
}

function drawOverlay(ctx, game) {
  ctx.fillStyle = COLOURS.overlay;
  ctx.fillRect(0, HUD_HEIGHT, WIDTH, HEIGHT - HUD_HEIGHT);
  ctx.fillStyle = COLOURS.ink;
  ctx.textAlign = "center";
  ctx.font = "36px 'Segoe UI', sans-serif";

  if (game.state === STATES.HIGH_SCORE_ENTRY) {
    ctx.fillText("NEW HIGH SCORE", WIDTH / 2, HEIGHT / 2 - 40);
    ctx.font = "42px 'Segoe UI', monospace";
    ctx.fillText((game.nameEntry || "_").padEnd(3, "_"), WIDTH / 2, HEIGHT / 2 + 16);
    ctx.font = "18px 'Segoe UI', sans-serif";
    ctx.fillStyle = COLOURS.muted;
    ctx.fillText("Type three letters, then Enter", WIDTH / 2, HEIGHT / 2 + 56);
    return;
  }

  ctx.fillText(game.state === STATES.GAME_OVER ? "GAME OVER" : "LEVEL CLEARED", WIDTH / 2, HEIGHT / 2 - 24);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText(
    game.state === STATES.GAME_OVER
      ? "Press Space or Escape for the title screen"
      : "Press Space for the next level",
    WIDTH / 2,
    HEIGHT / 2 + 16
  );
  if (game.state === STATES.GAME_OVER) {
    drawScoreTable(ctx, game.scores, HEIGHT / 2 + 56);
  }
}

export function createRenderer(canvas, assets) {
  const ctx = canvas.getContext("2d");

  return {
    draw(game) {
      ctx.imageSmoothingEnabled = true;
      ctx.textBaseline = "alphabetic";
      if (game.state === STATES.TITLE) {
        drawTitle(ctx, assets.logo);
        drawScoreTable(ctx, game.scores, 500);
        return;
      }
      drawPlayfield(ctx, game);
      if (
        game.state === STATES.GAME_OVER
        || game.state === STATES.LEVEL_CLEAR
        || game.state === STATES.HIGH_SCORE_ENTRY
      ) {
        drawOverlay(ctx, game);
      }
    }
  };
}
