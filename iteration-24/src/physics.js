import { MIN_VERTICAL_RATIO, PADDLE_MAX_ANGLE } from "./constants.js";
import { brickBounds } from "./bricks.js";
import { paddleBounds } from "./paddle.js";
import { setBallVelocity } from "./ball.js";

export function circleIntersectsAabb(cx, cy, radius, box) {
  const nearestX = Math.max(box.left, Math.min(cx, box.right));
  const nearestY = Math.max(box.top, Math.min(cy, box.bottom));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}

export function collideBallWithWalls(ball, playfield) {
  let hit = false;

  if (ball.x - ball.radius < playfield.left) {
    ball.x = playfield.left + ball.radius;
    ball.vx = Math.abs(ball.vx);
    hit = true;
  } else if (ball.x + ball.radius > playfield.right) {
    ball.x = playfield.right - ball.radius;
    ball.vx = -Math.abs(ball.vx);
    hit = true;
  }

  if (ball.y - ball.radius < playfield.top) {
    ball.y = playfield.top + ball.radius;
    ball.vy = Math.abs(ball.vy);
    hit = true;
  }

  return hit;
}

export function bounceOffPaddle(ball, paddle) {
  const half = paddle.width / 2 || 1;
  const offset = Math.max(-1, Math.min(1, (ball.x - paddle.x) / half));
  const angle = offset * PADDLE_MAX_ANGLE;
  let vx = Math.sin(angle);
  let vy = -Math.abs(Math.cos(angle));

  if (Math.abs(vy) < MIN_VERTICAL_RATIO) {
    vy = -MIN_VERTICAL_RATIO;
    const remaining = Math.sqrt(Math.max(0, 1 - vy * vy));
    vx = Math.sign(offset || 1) * remaining;
  }

  setBallVelocity(ball, vx, vy);
  ball.y = paddle.y - paddle.height / 2 - ball.radius - 0.5;
}

export function collideBallWithPaddle(ball, paddle) {
  if (ball.vy <= 0) {
    return false;
  }

  const box = paddleBounds(paddle);
  if (!circleIntersectsAabb(ball.x, ball.y, ball.radius, box)) {
    return false;
  }

  bounceOffPaddle(ball, paddle);
  return true;
}

export function ballHasFallen(ball, floorY) {
  return ball.y - ball.radius > floorY;
}

export function resolveCircleAabb(ball, box) {
  const overlapLeft = ball.x + ball.radius - box.left;
  const overlapRight = box.right - (ball.x - ball.radius);
  const overlapTop = ball.y + ball.radius - box.top;
  const overlapBottom = box.bottom - (ball.y - ball.radius);
  const minX = Math.min(overlapLeft, overlapRight);
  const minY = Math.min(overlapTop, overlapBottom);

  if (minX < minY) {
    if (overlapLeft < overlapRight) {
      ball.x = box.left - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    } else {
      ball.x = box.right + ball.radius;
      ball.vx = Math.abs(ball.vx);
    }
  } else if (overlapTop < overlapBottom) {
    ball.y = box.top - ball.radius;
    ball.vy = -Math.abs(ball.vy);
  } else {
    ball.y = box.bottom + ball.radius;
    ball.vy = Math.abs(ball.vy);
  }
}

export function hitBrick(brick) {
  brick.hits -= 1;
  if (brick.hits <= 0) {
    brick.alive = false;
    return true;
  }
  return false;
}

export function collideBallWithBricks(ball, bricks, options = {}) {
  const pierce = Boolean(options.pierce);
  let struck = null;

  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }
    const box = brickBounds(brick);
    if (!circleIntersectsAabb(ball.x, ball.y, ball.radius, box)) {
      continue;
    }
    if (!pierce) {
      resolveCircleAabb(ball, box);
    }
    struck = brick;
    break;
  }

  return struck;
}
