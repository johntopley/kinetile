import {
  AVAILABLE_POWERUPS,
  MAX_BALLS,
  MAX_LIVES,
  PADDLE_WIDTH,
  POWERUP_DROP_CHANCE,
  POWERUP_DURATION,
  POWERUP_FALL_SPEED,
  POWERUP_HEIGHT,
  POWERUP_TYPES,
  POWERUP_WIDTH,
  SLOW_TIME_SCALE,
  STATES,
  WIDE_PADDLE_WIDTH
} from "./constants.js";
import { createBall, releaseStuckBall, serveBall } from "./ball.js";
import { clampPaddle, paddleBounds } from "./paddle.js";

export function createEmptyEffects() {
  return {
    wide: 0,
    laser: 0,
    pierce: 0,
    slow: 0,
    catch: 0
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
  if (type === POWERUP_TYPES.LASER) {
    game.effects.laser = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.PIERCE) {
    game.effects.pierce = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.SLOW) {
    game.effects.slow = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.BREAK) {
    game.gateOpen = true;
  }
  if (type === POWERUP_TYPES.PLAYER) {
    game.lives = Math.min(MAX_LIVES, (game.lives ?? 0) + 1);
  }
  if (type === POWERUP_TYPES.CATCH) {
    game.effects.catch = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.MULTI) {
    if (game.state === STATES.PLAYING && game.balls.some((ball) => ball.vx || ball.vy)) {
      spawnExtraBalls(game);
    } else {
      game.pendingMulti = true;
    }
  }
}

export function spawnExtraBalls(game) {
  const source = game.balls[0] ?? game.ball;
  if (!source) {
    return;
  }
  const room = MAX_BALLS - game.balls.length;
  const extras = [];
  if (room > 0) {
    extras.push(ballFrom(source, -0.75));
  }
  if (room > 1) {
    extras.push(ballFrom(source, 0.75));
  }
  game.balls.push(...extras);
  game.ball = game.balls[0];
}

function ballFrom(source, angle) {
  const ball = createBall(source.speed);
  ball.x = source.x;
  ball.y = source.y;
  serveBall(ball, angle);
  return ball;
}

export function tickEffects(game, dt) {
  if (game.effects.wide > 0) {
    game.effects.wide = Math.max(0, game.effects.wide - dt);
    if (game.effects.wide === 0) {
      game.paddle.width = PADDLE_WIDTH;
      clampPaddle(game.paddle, game.playfield);
    }
  }
  if (game.effects.laser > 0) {
    game.effects.laser = Math.max(0, game.effects.laser - dt);
  }
  if (game.effects.pierce > 0) {
    game.effects.pierce = Math.max(0, game.effects.pierce - dt);
  }
  if (game.effects.slow > 0) {
    game.effects.slow = Math.max(0, game.effects.slow - dt);
  }
  if (game.effects.catch > 0) {
    game.effects.catch = Math.max(0, game.effects.catch - dt);
    if (game.effects.catch === 0) {
      releaseCaughtBalls(game);
    }
  }
}

export function releaseCaughtBalls(game) {
  const paddle = game.paddle;
  for (const ball of game.balls ?? []) {
    if (ball.stuck) {
      releaseStuckBall(ball, paddle);
    }
  }
}

export function motionScale(game) {
  return game.effects.slow > 0 ? SLOW_TIME_SCALE : 1;
}

export function resetEffects(game) {
  game.effects = createEmptyEffects();
  game.paddle.width = PADDLE_WIDTH;
  game.powerUps = [];
  game.missiles = [];
  game.fireCooldown = 0;
  game.pendingMulti = false;
  game.gateOpen = false;
  clampPaddle(game.paddle, game.playfield);
}
