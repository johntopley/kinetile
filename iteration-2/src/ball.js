import { BALL_RADIUS, BALL_SPEED } from "./constants.js";

export function createBall(speed = BALL_SPEED) {
  return {
    x: 0,
    y: 0,
    radius: BALL_RADIUS,
    vx: 0,
    vy: 0,
    speed
  };
}

export function placeBallOnPaddle(ball, paddle) {
  ball.x = paddle.x;
  ball.y = paddle.y - paddle.height / 2 - ball.radius - 1;
  ball.vx = 0;
  ball.vy = 0;
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
