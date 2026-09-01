import { describe, expect, it } from "vitest";
import { FAST_SCALE, POWERUP_TYPES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { speedForLevel } from "../src/levels.js";
import { applyPowerUp } from "../src/powerups.js";

describe("fast", () => {
  it("raises ball speed while the effect is active", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.FAST);
    expect(game.ball.speed).toBeCloseTo(speedForLevel(1) * FAST_SCALE);
  });

  it("restores level speed when the timer expires", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.FAST);
    step(game, 11);
    expect(game.effects.fast).toBe(0);
    expect(game.ball.speed).toBeCloseTo(speedForLevel(1));
  });
});
