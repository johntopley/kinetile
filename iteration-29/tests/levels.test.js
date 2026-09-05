import { describe, expect, it } from "vitest";
import {
  BALL_RADIUS,
  BALL_SPEED,
  BRICK_HEIGHT,
  BRICK_OFFSET_Y,
  LEVEL_SPEED_STEP,
  MAX_BALL_SPEED,
  PLAYFIELD_TOP
} from "../src/constants.js";
import { remainingBricks } from "../src/bricks.js";
import { speedForLevel, wallForLevel } from "../src/levels.js";

describe("levels", () => {
  it("builds the same wall for the same seed and level", () => {
    const first = wallForLevel(42, 2);
    const second = wallForLevel(42, 2);
    expect(first).toHaveLength(second.length);
    expect(first.map((brick) => `${brick.col},${brick.row}`)).toEqual(
      second.map((brick) => `${brick.col},${brick.row}`)
    );
    expect(remainingBricks(first).length).toBeGreaterThan(0);
  });

  it("changes the formation when the level changes", () => {
    const one = wallForLevel(42, 1).map((brick) => `${brick.col},${brick.row}`).join("|");
    const two = wallForLevel(42, 2).map((brick) => `${brick.col},${brick.row}`).join("|");
    expect(one).not.toBe(two);
  });

  it("ramps ball speed with the level and then caps it", () => {
    expect(speedForLevel(1)).toBe(BALL_SPEED);
    expect(speedForLevel(2)).toBe(BALL_SPEED + LEVEL_SPEED_STEP);
    expect(speedForLevel(100)).toBe(MAX_BALL_SPEED);
  });

  it("keeps most bricks to a single hit", () => {
    const wall = wallForLevel(42, 1);
    const multi = wall.filter((brick) => brick.maxHits > 1);
    expect(multi.length).toBeLessThan(wall.length * 0.15);
  });

  it("leaves a lane above the top row for the ball", () => {
    const wall = wallForLevel(42, 1);
    const top = Math.min(...wall.map((brick) => brick.y));
    expect(top).toBe(BRICK_OFFSET_Y);
    expect(BRICK_OFFSET_Y - PLAYFIELD_TOP).toBeGreaterThanOrEqual(BRICK_HEIGHT);
    expect(BRICK_OFFSET_Y - PLAYFIELD_TOP).toBeGreaterThan(BALL_RADIUS * 2);
  });
});
