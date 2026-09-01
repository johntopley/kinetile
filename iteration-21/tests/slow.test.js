import { describe, expect, it } from "vitest";
import { PADDLE_SPEED, POWERUP_TYPES, WIDTH } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { applyPowerUp, motionScale } from "../src/powerups.js";

describe("slow", () => {
  it("halves bat travel while the effect is active", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.SLOW);
    expect(motionScale(game)).toBe(0.5);
    const start = game.paddle.x;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.paddle.x).toBeCloseTo(start + PADDLE_SPEED * 0.1);
  });

  it("restores full speed when the timer expires", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.SLOW);
    step(game, 10);
    expect(game.effects.slow).toBe(0);
    expect(motionScale(game)).toBe(1);
    const start = game.paddle.x;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.paddle.x).toBeCloseTo(Math.min(start + PADDLE_SPEED * 0.2, game.playfield.right - game.paddle.width / 2));
    expect(start).toBeGreaterThan(0);
    expect(WIDTH).toBeGreaterThan(start);
  });
});
