import {
  AVAILABLE_POWERUPS,
  MAX_BALLS,
  MAX_LIVES,
  FAST_SCALE,
  NARROW_PADDLE_WIDTH,
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
import { createBall, releaseStuckBall, serveBall, setBallVelocity } from "./ball.js";
import { speedForLevel } from "./levels.js";
import { clampPaddle, mirroredPaddle, paddleBounds } from "./paddle.js";

export function createEmptyEffects() {
  return {
    wide: 0,
    laser: 0,
    pierce: 0,
    slow: 0,
    catch: 0,
    reduce: 0,
    fast: 0,
    reverse: 0,
    fire: 0,
    twin: 0,
    magnet: 0
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

export function collectPowerUps(powerUps, paddleOrPaddles) {
  const bats = [].concat(paddleOrPaddles).map((paddle) => paddleBounds(paddle));
  const collected = [];
  const remaining = [];

  for (const item of powerUps) {
    const box = powerUpBounds(item);
    const overlaps = bats.some((bat) => (
      box.left < bat.right
      && box.right > bat.left
      && box.top < bat.bottom
      && box.bottom > bat.top
    ));
    if (overlaps) {
      collected.push(item);
    } else {
      remaining.push(item);
    }
  }

  return { collected, remaining };
}

export function applyPowerUp(game, type) {
  if (type === POWERUP_TYPES.MYSTERY) {
    const pool = AVAILABLE_POWERUPS.filter((item) => item !== POWERUP_TYPES.MYSTERY);
    const pick = pool[Math.floor((game.dropRng?.() ?? 0) * pool.length)] ?? pool[0];
    applyPowerUp(game, pick);
    return;
  }
  if (type === POWERUP_TYPES.WIDE) {
    game.effects.wide = POWERUP_DURATION;
    game.effects.reduce = 0;
    syncPaddleWidth(game);
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
  if (type === POWERUP_TYPES.REDUCE) {
    game.effects.reduce = POWERUP_DURATION;
    game.effects.wide = 0;
    syncPaddleWidth(game);
  }
  if (type === POWERUP_TYPES.FAST) {
    game.effects.fast = POWERUP_DURATION;
    syncBallSpeeds(game);
  }
  if (type === POWERUP_TYPES.REVERSE) {
    game.effects.reverse = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.FIREBALL) {
    game.effects.fire = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.TWIN) {
    game.effects.twin = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.MAGNET) {
    game.effects.magnet = POWERUP_DURATION;
  }
  if (type === POWERUP_TYPES.BARRIER) {
    game.barrier = 1;
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
      syncPaddleWidth(game);
    }
  }
  if (game.effects.reduce > 0) {
    game.effects.reduce = Math.max(0, game.effects.reduce - dt);
    if (game.effects.reduce === 0) {
      syncPaddleWidth(game);
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
  if (game.effects.fast > 0) {
    game.effects.fast = Math.max(0, game.effects.fast - dt);
    if (game.effects.fast === 0) {
      syncBallSpeeds(game);
    }
  }
  if (game.effects.reverse > 0) {
    game.effects.reverse = Math.max(0, game.effects.reverse - dt);
  }
  if (game.effects.fire > 0) {
    game.effects.fire = Math.max(0, game.effects.fire - dt);
  }
  if (game.effects.twin > 0) {
    game.effects.twin = Math.max(0, game.effects.twin - dt);
    if (game.effects.twin === 0) {
      releaseCaughtBalls(game);
    }
  }
  if (game.effects.magnet > 0) {
    game.effects.magnet = Math.max(0, game.effects.magnet - dt);
  }
}

export function releaseCaughtBalls(game) {
  for (const ball of game.balls ?? []) {
    if (ball.stuck) {
      const paddle = ball.catchTwin ? mirroredPaddle(game.paddle) : game.paddle;
      releaseStuckBall(ball, paddle);
      ball.catchTwin = false;
    }
  }
}

export function ballSpeedScale(game) {
  let scale = 1;
  if (game.effects.fast > 0) {
    scale *= FAST_SCALE;
  }
  return scale;
}

export function syncBallSpeeds(game) {
  const base = speedForLevel(game.level ?? 1);
  const speed = base * ballSpeedScale(game);
  for (const ball of game.balls ?? []) {
    ball.speed = speed;
    if (!ball.stuck && (ball.vx !== 0 || ball.vy !== 0)) {
      setBallVelocity(ball, ball.vx, ball.vy);
    }
  }
}

export function syncPaddleWidth(game) {
  if (game.effects.wide > 0) {
    game.paddle.width = WIDE_PADDLE_WIDTH;
  } else if (game.effects.reduce > 0) {
    game.paddle.width = NARROW_PADDLE_WIDTH;
  } else {
    game.paddle.width = PADDLE_WIDTH;
  }
  if (game.playfield) {
    clampPaddle(game.paddle, game.playfield);
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
  game.barrier = 0;
  clampPaddle(game.paddle, game.playfield);
  syncBallSpeeds(game);
}
