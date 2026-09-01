import { describe, expect, it } from "vitest";
import { POWERUP_TYPES, STATES, WIDTH } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("break gate", () => {
  it("opens a gate and clears the level when the bat leaves", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.BREAK);
    expect(game.gateOpen).toBe(true);
    game.paddle.x = WIDTH;
    step(game, 0);
    expect(game.state).toBe(STATES.LEVEL_CLEAR);
    expect(game.gateOpen).toBe(false);
  });
});
