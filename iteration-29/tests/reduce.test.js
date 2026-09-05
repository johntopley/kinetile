import { describe, expect, it } from "vitest";
import {
  NARROW_PADDLE_WIDTH,
  PADDLE_WIDTH,
  POWERUP_DURATION,
  POWERUP_TYPES,
  WIDE_PADDLE_WIDTH
} from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("reduce", () => {
  it("shrinks the bat and restores it when the timer expires", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.REDUCE);
    expect(game.paddle.width).toBe(NARROW_PADDLE_WIDTH);
    expect(game.effects.reduce).toBe(POWERUP_DURATION);

    step(game, 11);
    expect(game.effects.reduce).toBe(0);
    expect(game.paddle.width).toBe(PADDLE_WIDTH);
  });

  it("lets Wide cancel Reduce and take the longer bat", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.REDUCE);
    applyPowerUp(game, POWERUP_TYPES.WIDE);
    expect(game.effects.reduce).toBe(0);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
  });

  it("lets Reduce cancel Wide", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.WIDE);
    applyPowerUp(game, POWERUP_TYPES.REDUCE);
    expect(game.effects.wide).toBe(0);
    expect(game.paddle.width).toBe(NARROW_PADDLE_WIDTH);
  });
});
