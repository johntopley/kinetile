import { describe, expect, it } from "vitest";
import { BALL_SPEED, MIN_VERTICAL_RATIO } from "../src/constants.js";
import { createBall } from "../src/ball.js";
import { createPaddle } from "../src/paddle.js";
import {
  ballHasFallen,
  bounceOffPaddle,
  collideBallWithWalls
} from "../src/physics.js";

describe("physics", () => {
  it("reflects the ball off the left and right walls", () => {
    const ball = createBall();
    ball.x = 10;
    ball.y = 200;
    ball.vx = -200;
    ball.vy = 80;
    collideBallWithWalls(ball, { left: 16, right: 944, top: 96, bottom: 720 });
    expect(ball.vx).toBeGreaterThan(0);
    expect(ball.x).toBeGreaterThanOrEqual(16 + ball.radius);

    ball.x = 940;
    ball.vx = 200;
    collideBallWithWalls(ball, { left: 16, right: 944, top: 96, bottom: 720 });
    expect(ball.vx).toBeLessThan(0);
  });

  it("lifts a flat wall bounce off the horizontal", () => {
    const ball = createBall();
    ball.x = 10;
    ball.y = 200;
    ball.vx = -BALL_SPEED;
    ball.vy = 0;
    collideBallWithWalls(ball, { left: 16, right: 944, top: 96, bottom: 720 });
    expect(ball.vx).toBeGreaterThan(0);
    expect(Math.abs(ball.vy)).toBeGreaterThanOrEqual(BALL_SPEED * MIN_VERTICAL_RATIO - 1e-6);
  });

  it("reflects the ball off the top wall", () => {
    const ball = createBall();
    ball.x = 200;
    ball.y = 90;
    ball.vx = 40;
    ball.vy = -180;
    collideBallWithWalls(ball, { left: 16, right: 944, top: 96, bottom: 720 });
    expect(ball.vy).toBeGreaterThan(0);
    expect(ball.y).toBeGreaterThanOrEqual(96 + ball.radius);
  });

  it("steers the rebound from the bat centre offset", () => {
    const paddle = createPaddle();
    const centre = createBall();
    centre.x = paddle.x;
    bounceOffPaddle(centre, paddle);
    expect(centre.vx).toBeCloseTo(0, 1);
    expect(centre.vy).toBeLessThan(0);

    const right = createBall();
    right.x = paddle.x + paddle.width / 2;
    bounceOffPaddle(right, paddle);
    expect(right.vx).toBeGreaterThan(0);
    expect(right.vy).toBeLessThan(0);
    expect(Math.hypot(right.vx, right.vy)).toBeCloseTo(BALL_SPEED);
  });

  it("keeps a minimum vertical component after a rim hit", () => {
    const paddle = createPaddle();
    const ball = createBall();
    ball.x = paddle.x + paddle.width / 2;
    bounceOffPaddle(ball, paddle);
    expect(Math.abs(ball.vy)).toBeGreaterThanOrEqual(BALL_SPEED * MIN_VERTICAL_RATIO - 1e-6);
  });

  it("detects a ball that has fallen off the bottom", () => {
    const ball = createBall();
    ball.y = 800;
    expect(ballHasFallen(ball, 720)).toBe(true);
    ball.y = 400;
    expect(ballHasFallen(ball, 720)).toBe(false);
  });
});
