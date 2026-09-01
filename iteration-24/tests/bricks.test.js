import { describe, expect, it } from "vitest";
import {
  BRICK_COLUMNS,
  BRICK_HEIGHT,
  BRICK_OFFSET_X,
  BRICK_OFFSET_Y,
  BRICK_ROWS,
  BRICK_WIDTH
} from "../src/constants.js";
import { createBall } from "../src/ball.js";
import { createFixedWall, remainingBricks } from "../src/bricks.js";
import { collideBallWithBricks, hitBrick, resolveCircleAabb } from "../src/physics.js";

describe("bricks", () => {
  it("builds an 8 by 14 wall", () => {
    const bricks = createFixedWall();
    expect(bricks).toHaveLength(BRICK_ROWS * BRICK_COLUMNS);
    expect(remainingBricks(bricks)).toHaveLength(112);
    expect(bricks[0].x).toBe(BRICK_OFFSET_X);
    expect(bricks[0].y).toBe(BRICK_OFFSET_Y);
    expect(bricks[1].x).toBe(BRICK_OFFSET_X + BRICK_WIDTH);
    expect(bricks[BRICK_COLUMNS].y).toBe(BRICK_OFFSET_Y + BRICK_HEIGHT);
  });

  it("removes a brick and reflects the ball on the shallow axis", () => {
    const bricks = createFixedWall();
    const target = bricks[0];
    const ball = createBall();
    ball.x = target.x + target.width / 2;
    ball.y = target.y + target.height + ball.radius - 1;
    ball.vx = 0;
    ball.vy = -200;

    const struck = collideBallWithBricks(ball, bricks);
    expect(struck).toBe(target);
    hitBrick(struck);
    expect(target.alive).toBe(false);
    expect(ball.vy).toBeGreaterThan(0);
  });

  it("reflects horizontally when the side overlap is shallower", () => {
    const box = { left: 100, right: 160, top: 100, bottom: 122 };
    const ball = createBall();
    ball.x = 96;
    ball.y = 111;
    ball.vx = 180;
    ball.vy = 10;
    resolveCircleAabb(ball, box);
    expect(ball.vx).toBeLessThan(0);
  });
});
