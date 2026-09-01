import {
  AVAILABLE_POWERUPS,
  PADDLE_WIDTH,
  POWERUP_DROP_CHANCE,
  POWERUP_DURATION,
  POWERUP_FALL_SPEED,
  POWERUP_HEIGHT,
  POWERUP_TYPES,
  POWERUP_WIDTH,
  WIDE_PADDLE_WIDTH
} from "./constants.js";
import { clampPaddle, paddleBounds } from "./paddle.js";

export function createEmptyEffects() {
  return {
    wide: 0,
    laser: 0,
    pierce: 0,
    slow: 0
  };
}

export function createPowerUp(type, x, y) {
  return {
    type,
    x,
    y,
    width: POWERUP_WIDTH,
    height: POWERUP_HEIGHT,
    vy: POWERUP_FALL_SPEED
  };
}

export function maybeDropPowerUp(rng, brick, types = AVAILABLE_POWERUPS) {
  if (rng() >= POWERUP_DROP_CHANCE) {
    return null;
  }
  const type = types[Math.floor(rng() * types.length)] ?? types[0];
  return createPowerUp(type, brick.x + brick.width / 2, brick.y + brick.height / 2);
}

export function updatePowerUps(powerUps, dt, floorY) {
  for (const item of powerUps) {
    item.y += item.vy * dt;
  }
  return powerUps.filter((item) => item.y - item.height / 2 < floorY + 40);
}

export function powerUpBounds(item) {
  return {
    left: item.x - item.width / 2,
    right: item.x + item.width / 2,
    top: item.y - item.height / 2,
    bottom: item.y + item.height / 2
  };
}

export function collectPowerUps(powerUps, paddle) {
  const bat = paddleBounds(paddle);
  const collected = [];
  const remaining = [];

  for (const item of powerUps) {
    const box = powerUpBounds(item);
    const overlaps = box.left < bat.right
      && box.right > bat.left
      && box.top < bat.bottom
      && box.bottom > bat.top;
    if (overlaps) {
      collected.push(item);
    } else {
      remaining.push(item);
    }
  }

  return { collected, remaining };
}

export function applyPowerUp(game, type) {
  if (type === POWERUP_TYPES.WIDE) {
    game.effects.wide = POWERUP_DURATION;
    game.paddle.width = WIDE_PADDLE_WIDTH;
    clampPaddle(game.paddle, game.playfield);
  }
}

export function tickEffects(game, dt) {
  if (game.effects.wide > 0) {
    game.effects.wide = Math.max(0, game.effects.wide - dt);
    if (game.effects.wide === 0) {
      game.paddle.width = PADDLE_WIDTH;
      clampPaddle(game.paddle, game.playfield);
    }
  }
}

export function resetEffects(game) {
  game.effects = createEmptyEffects();
  game.paddle.width = PADDLE_WIDTH;
  game.powerUps = [];
  clampPaddle(game.paddle, game.playfield);
}
