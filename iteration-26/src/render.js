import {
  BARRIER_Y,
  GATE_HEIGHT,
  GATE_TOP,
  HEIGHT,
  HUD_HEIGHT,
  INITIAL_LIVES,
  ITERATION,
  MONOCHROME,
  STATES,
  WALL_THICKNESS,
  WIDTH
} from "./constants.js";
import { brickDrawOrigin } from "./bricks.js";
import { mirroredPaddle, paddleBounds } from "./paddle.js";
import {
  brickFaceColour,
  COLOURS,
  darken,
  lighten
} from "./palette.js";

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
  ctx.fillText("ITERATION 26 — MYSTERY", WIDTH / 2, 400);
  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText("A grey capsule is a lucky dip.", WIDTH / 2, 432);
  ctx.fillText("Press Space or Enter to begin", WIDTH / 2, 458);
}

function fillBevelledRect(ctx, x, y, width, height, colour, radius = 2) {
  const highlight = lighten(colour, 0.42);
  const shade = darken(colour, 0.38);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = colour;
  ctx.fill();

  ctx.fillStyle = highlight;
  ctx.fillRect(x + 1, y + 1, width - 2, 3);
  ctx.fillRect(x + 1, y + 1, 3, height - 2);

  ctx.fillStyle = shade;
  ctx.fillRect(x + 1, y + height - 4, width - 2, 3);
  ctx.fillRect(x + width - 4, y + 1, 3, height - 2);
}

function drawWalls(ctx, game) {
  fillBevelledRect(ctx, 0, HUD_HEIGHT, WALL_THICKNESS, HEIGHT - HUD_HEIGHT, COLOURS.wall, 0);
  const gateBottom = GATE_TOP + GATE_HEIGHT;
  if (game.gateOpen) {
    fillBevelledRect(
      ctx,
      WIDTH - WALL_THICKNESS,
      HUD_HEIGHT,
      WALL_THICKNESS,
      GATE_TOP - HUD_HEIGHT,
      COLOURS.wall,
      0
    );
    if (HEIGHT - gateBottom > 0) {
      fillBevelledRect(
        ctx,
        WIDTH - WALL_THICKNESS,
        gateBottom,
        WALL_THICKNESS,
        HEIGHT - gateBottom,
        COLOURS.wall,
        0
      );
    }
    ctx.fillStyle = lighten(COLOURS.paddle, 0.2);
    ctx.fillRect(WIDTH - WALL_THICKNESS, GATE_TOP, WALL_THICKNESS, 3);
    if (HEIGHT - gateBottom > 0) {
      ctx.fillRect(WIDTH - WALL_THICKNESS, gateBottom - 3, WALL_THICKNESS, 3);
    }
  } else {
    fillBevelledRect(
      ctx,
      WIDTH - WALL_THICKNESS,
      HUD_HEIGHT,
      WALL_THICKNESS,
      HEIGHT - HUD_HEIGHT,
      COLOURS.wall,
      0
    );
  }
  fillBevelledRect(ctx, 0, HUD_HEIGHT, WIDTH, WALL_THICKNESS, COLOURS.wall, 0);

  ctx.strokeStyle = COLOURS.wallHighlight;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(WALL_THICKNESS + 0.5, HUD_HEIGHT + WALL_THICKNESS);
  ctx.lineTo(WALL_THICKNESS + 0.5, HEIGHT);
  ctx.moveTo(WIDTH - WALL_THICKNESS - 0.5, HUD_HEIGHT + WALL_THICKNESS);
  ctx.lineTo(WIDTH - WALL_THICKNESS - 0.5, HEIGHT);
  ctx.stroke();
  ctx.globalAlpha = 1;
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
  if (game.barrier > 0) {
    return "Barrier armed — one miss will bounce";
  }
  if (game.effects.reduce > 0) {
    return `Reduce  ${game.effects.reduce.toFixed(1)}s`;
  }
  if (game.effects.fast > 0) {
    return `Fast ball  ${game.effects.fast.toFixed(1)}s`;
  }
  if (game.effects.reverse > 0) {
    return `Reverse  ${game.effects.reverse.toFixed(1)}s`;
  }
  if (game.effects.fire > 0) {
    return `Fireball  ${game.effects.fire.toFixed(1)}s`;
  }
  if (game.effects.twin > 0) {
    return `Twin bat  ${game.effects.twin.toFixed(1)}s`;
  }
  if (game.effects.magnet > 0) {
    return `Magnet  ${game.effects.magnet.toFixed(1)}s`;
  }
  if (game.gateOpen) {
    return "Gate open — drive the bat through the right wall";
  }
  if (game.effects.catch > 0) {
    return `Catch  ${game.effects.catch.toFixed(1)}s  ·  Space to throw`;
  }
  if (game.effects.slow > 0) {
    return `Half speed  ${game.effects.slow.toFixed(1)}s`;
  }
  if (game.balls.length > 1) {
    return `${game.balls.length} balls in play`;
  }
  if (game.effects.pierce > 0) {
    return `Piercing ball  ${game.effects.pierce.toFixed(1)}s`;
  }
  if (game.effects.laser > 0) {
    return `Lasers  ${game.effects.laser.toFixed(1)}s  ·  Space to fire`;
  }
  if (game.effects.wide > 0) {
    return `Wide bat  ${game.effects.wide.toFixed(1)}s`;
  }
  return "Catch falling capsules";
}

function drawPaddle(ctx, paddle, effects = {}) {
  const box = paddleBounds(paddle);
  const colour = effects.laser > 0
    ? COLOURS.powerUps.LASER
    : effects.magnet > 0
      ? COLOURS.powerUps.MAGNET
      : COLOURS.paddle;
  ctx.save();
  ctx.shadowColor = colour;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.roundRect(box.left, box.top, paddle.width, paddle.height, paddle.height / 2);
  const gradient = ctx.createLinearGradient(box.left, box.top, box.left, box.bottom);
  gradient.addColorStop(0, lighten(colour, 0.55));
  gradient.addColorStop(0.45, colour);
  gradient.addColorStop(1, darken(colour, 0.35));
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = COLOURS.paddleMetal;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.roundRect(box.left + 10, box.top + 3, paddle.width - 20, 4, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = darken(colour, 0.25);
  ctx.fillRect(paddle.x - 10, box.top + 2, 20, paddle.height - 4);
  ctx.fillStyle = lighten(colour, 0.35);
  ctx.beginPath();
  ctx.arc(paddle.x, paddle.y, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = darken(colour, 0.2);
  ctx.fillRect(box.left + 6, box.top + 4, 5, paddle.height - 8);
  ctx.fillRect(box.right - 11, box.top + 4, 5, paddle.height - 8);

  if (effects.laser > 0) {
    ctx.fillStyle = COLOURS.powerUps.LASER;
    ctx.fillRect(box.left + 8, box.top - 3, 3, 4);
    ctx.fillRect(box.right - 11, box.top - 3, 3, 4);
  }
  ctx.restore();
}

function drawBall(ctx, ball, piercing, burning = false) {
  const colour = burning
    ? COLOURS.powerUps.FIREBALL
    : piercing
      ? COLOURS.powerUps.PIERCE
      : COLOURS.ball;
  ctx.save();
  ctx.shadowColor = burning ? COLOURS.powerUps.FIREBALL : piercing ? COLOURS.powerUps.PIERCE : "#ff6ad5";
  ctx.shadowBlur = piercing ? 16 : 10;
  const gradient = ctx.createRadialGradient(
    ball.x - ball.radius * 0.35,
    ball.y - ball.radius * 0.4,
    1,
    ball.x,
    ball.y,
    ball.radius
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.35, colour);
  gradient.addColorStop(1, darken(colour, 0.45));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(ball.x - ball.radius * 0.35, ball.y - ball.radius * 0.4, ball.radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBricks(ctx, bricks) {
  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }
    const origin = brickDrawOrigin(brick);
    const face = brickFaceColour(brick);
    fillBevelledRect(ctx, origin.x, origin.y, brick.width, brick.height, face, 3);

    ctx.fillStyle = lighten(face, 0.5);
    ctx.globalAlpha = 0.18;
    ctx.fillRect(origin.x + 6, origin.y + 5, brick.width - 12, 6);
    ctx.globalAlpha = 1;

    if (brick.shifting && !brick.shifted) {
      ctx.strokeStyle = COLOURS.ink;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(origin.x + 1, origin.y + 1, brick.width - 2, brick.height - 2);
      ctx.setLineDash([]);
    }
    if (brick.maxHits > 1) {
      ctx.fillStyle = COLOURS.ink;
      for (let pip = 0; pip < brick.hits; pip += 1) {
        ctx.beginPath();
        ctx.roundRect(origin.x + 7 + pip * 8, origin.y + brick.height / 2 - 2, 5, 4, 1);
        ctx.fill();
      }
      if (brick.hits < brick.maxHits) {
        ctx.strokeStyle = darken(face, 0.5);
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(origin.x + 8, origin.y + 6);
        ctx.lineTo(origin.x + brick.width - 10, origin.y + brick.height - 6);
        ctx.moveTo(origin.x + brick.width * 0.35, origin.y + 4);
        ctx.lineTo(origin.x + brick.width * 0.7, origin.y + brick.height - 5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function drawPowerUps(ctx, powerUps) {
  ctx.font = "12px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const item of powerUps) {
    const colour = COLOURS.powerUps[item.type] ?? COLOURS.ink;
    const x = item.x - item.width / 2;
    const y = item.y - item.height / 2;
    fillBevelledRect(ctx, x, y, item.width, item.height, colour, 8);
    ctx.fillStyle = COLOURS.background;
    ctx.fillText(item.type[0], item.x, item.y + 1);
  }
  ctx.textBaseline = "alphabetic";
}

function drawMissiles(ctx, missiles) {
  for (const missile of missiles) {
    const x = missile.x - missile.width / 2;
    const y = missile.y - missile.height / 2;
    ctx.fillStyle = COLOURS.powerUps.LASER;
    ctx.shadowColor = COLOURS.powerUps.LASER;
    ctx.shadowBlur = 8;
    ctx.fillRect(x, y, missile.width, missile.height);
    ctx.shadowBlur = 0;
    ctx.fillStyle = lighten(COLOURS.powerUps.LASER, 0.5);
    ctx.fillRect(x + 1, y, Math.max(1, missile.width - 2), 4);
  }
}

function drawCourt(ctx) {
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = COLOURS.court;
  ctx.fillRect(
    WALL_THICKNESS,
    HUD_HEIGHT + WALL_THICKNESS,
    WIDTH - WALL_THICKNESS * 2,
    HEIGHT - HUD_HEIGHT - WALL_THICKNESS
  );
}

function drawPlayfield(ctx, game) {
  drawCourt(ctx);
  drawHud(ctx, game);
  drawWalls(ctx, game);
  if (game.barrier > 0) {
    ctx.save();
    ctx.shadowColor = COLOURS.powerUps.BARRIER;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLOURS.powerUps.BARRIER;
    ctx.fillRect(WALL_THICKNESS, BARRIER_Y, WIDTH - WALL_THICKNESS * 2, 3);
    ctx.restore();
  }
  drawBricks(ctx, game.bricks);
  drawPowerUps(ctx, game.powerUps);
  drawMissiles(ctx, game.missiles);
  drawPaddle(ctx, game.paddle, game.effects);
  if (game.effects.twin > 0) {
    drawPaddle(ctx, mirroredPaddle(game.paddle), game.effects);
  }
  for (const ball of game.balls) {
    drawBall(ctx, ball, game.effects.pierce > 0 || game.effects.fire > 0, game.effects.fire > 0);
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
