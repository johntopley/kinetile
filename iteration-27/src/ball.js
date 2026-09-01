import { BALL_RADIUS, BALL_SPEED } from "./constants.js";

export function createBall(speed = BALL_SPEED) {
  return {
    x: 0,
    y: 0,
    radius: BALL_RADIUS,
    vx: 0,
    vy: 0,
    speed,
    stuck: false,
    catchOffset: 0,
    catchTwin: false
  };
}

export function placeBallOnPaddle(ball, paddle) {
  ball.x = paddle.x + (ball.catchOffset || 0);
  ball.y = paddle.y - paddle.height / 2 - ball.radius - 1;
  ball.vx = 0;
  ball.vy = 0;
}

export function stickBallToPaddle(ball, paddle) {
  ball.stuck = true;
  ball.catchOffset = ball.x - paddle.x;
  ball.vx = 0;
  ball.vy = 0;
  placeBallOnPaddle(ball, paddle);
}

export function releaseStuckBall(ball, paddle) {
  if (!ball.stuck) {
    return false;
  }
  ball.stuck = false;
  const half = paddle.width / 2 || 1;
  const offset = Math.max(-1, Math.min(1, ball.catchOffset / half));
  serveBall(ball, offset * 0.7);
  ball.catchOffset = 0;
  return true;
}

export function serveBall(ball, angle = -0.35) {
  const speed = ball.speed;
  ball.vx = Math.sin(angle) * speed;
  ball.vy = -Math.abs(Math.cos(angle) * speed);
}

export function integrateBall(ball, dt) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
}

export function setBallVelocity(ball, vx, vy) {
  const speed = ball.speed;
  const length = Math.hypot(vx, vy) || 1;
  ball.vx = (vx / length) * speed;
  ball.vy = (vy / length) * speed;
}
