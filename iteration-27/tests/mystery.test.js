import { describe, expect, it } from "vitest";
import {
  AVAILABLE_POWERUPS,
  INITIAL_LIVES,
  POWERUP_DURATION,
  POWERUP_TYPES,
  WIDE_PADDLE_WIDTH
} from "../src/constants.js";
import { createGame, startMatch } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("mystery", () => {
  it("resolves to another catalogue type using the drop RNG", () => {
    const game = createGame({ dropRng: () => 0 });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.MYSTERY);
    expect(game.effects.wide).toBe(POWERUP_DURATION);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
  });

  it("can be forced to an extra life", () => {
    const pool = AVAILABLE_POWERUPS.filter((type) => type !== POWERUP_TYPES.MYSTERY);
    const index = pool.indexOf(POWERUP_TYPES.PLAYER);
    const game = createGame({
      dropRng: () => (index + 0.5) / pool.length
    });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.MYSTERY);
    expect(game.lives).toBe(INITIAL_LIVES + 1);
  });
});
