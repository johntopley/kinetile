import { describe, expect, it } from "vitest";
import { PADDLE_SPEED, POWERUP_TYPES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { applyPowerUp } from "../src/powerups.js";

describe("reverse", () => {
  it("sends the bat left when the right key is held", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.REVERSE);
    const start = game.paddle.x;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.paddle.x).toBeCloseTo(start - PADDLE_SPEED * 0.2);
  });

  it("restores normal steering when the timer expires", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.REVERSE);
    step(game, 11);
    expect(game.effects.reverse).toBe(0);
    const start = game.paddle.x;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.paddle.x).toBeCloseTo(start + PADDLE_SPEED * 0.2);
  });
});
