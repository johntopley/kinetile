import { describe, expect, it } from "vitest";
import { MAX_LIVES, POWERUP_TYPES } from "../src/constants.js";
import { createGame, startMatch } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("extra life", () => {
  it("adds a life up to the cap", () => {
    const game = createGame();
    startMatch(game);
    expect(game.lives).toBe(3);
    applyPowerUp(game, POWERUP_TYPES.PLAYER);
    expect(game.lives).toBe(4);
    game.lives = MAX_LIVES;
    applyPowerUp(game, POWERUP_TYPES.PLAYER);
    expect(game.lives).toBe(MAX_LIVES);
    expect(game.effects.catch).toBe(0);
  });
});
