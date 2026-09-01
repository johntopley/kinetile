import {
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PADDLE_Y,
  WIDTH
} from "./constants.js";

export function createPaddle() {
  return {
    x: WIDTH / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    vx: 0
  };
}

export function paddleBounds(paddle) {
  return {
    left: paddle.x - paddle.width / 2,
    right: paddle.x + paddle.width / 2,
    top: paddle.y - paddle.height / 2,
    bottom: paddle.y + paddle.height / 2
  };
}

export function clampPaddle(paddle, playfield) {
  const half = paddle.width / 2;
  const minX = playfield.left + half;
  const maxX = playfield.right - half;

  if (paddle.x < minX) {
    paddle.x = minX;
    paddle.vx = 0;
  } else if (paddle.x > maxX) {
    paddle.x = maxX;
    paddle.vx = 0;
  }
}

export function updatePaddle(paddle, input, dt, playfield) {
  let dir = 0;
  if (input.left()) {
    dir -= 1;
  }
  if (input.right()) {
    dir += 1;
  }

  paddle.vx = dir * PADDLE_SPEED;
  paddle.x += paddle.vx * dt;
  clampPaddle(paddle, playfield);
}
