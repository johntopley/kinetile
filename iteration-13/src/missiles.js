import { LASER_HEIGHT, LASER_SPEED, LASER_WIDTH } from "./constants.js";
import { brickBounds } from "./bricks.js";

export function createMissile(x, y) {
  return {
    x,
    y,
    width: LASER_WIDTH,
    height: LASER_HEIGHT,
    vy: -LASER_SPEED
  };
}

export function fireLasers(paddle) {
  const left = paddle.x - paddle.width / 2 + 10;
  const right = paddle.x + paddle.width / 2 - 10;
  const y = paddle.y - paddle.height / 2 - LASER_HEIGHT / 2;
  return [createMissile(left, y), createMissile(right, y)];
}

export function updateMissiles(missiles, dt) {
  for (const missile of missiles) {
    missile.y += missile.vy * dt;
  }
  return missiles.filter((missile) => missile.y + missile.height / 2 > 0);
}

export function collideMissilesWithBricks(missiles, bricks) {
  const remaining = [];
  const hits = [];

  for (const missile of missiles) {
    const box = {
      left: missile.x - missile.width / 2,
      right: missile.x + missile.width / 2,
      top: missile.y - missile.height / 2,
      bottom: missile.y + missile.height / 2
    };
    let struck = null;
    for (const brick of bricks) {
      if (!brick.alive) {
        continue;
      }
      const target = brickBounds(brick);
      const overlaps = box.left < target.right
        && box.right > target.left
        && box.top < target.bottom
        && box.bottom > target.top;
      if (overlaps) {
        struck = brick;
        break;
      }
    }
    if (struck) {
      hits.push(struck);
    } else {
      remaining.push(missile);
    }
  }

  return { remaining, hits };
}
