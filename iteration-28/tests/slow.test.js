import { describe, expect, it } from "vitest";
import { BALL_SLOW_SCALE, PADDLE_SPEED, POWERUP_TYPES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { speedForLevel } from "../src/levels.js";
import { applyPowerUp } from "../src/powerups.js";

describe("slow", () => {
  it("halves ball speed without slowing the bat", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.SLOW);
    expect(game.ball.speed).toBeCloseTo(speedForLevel(1) * BALL_SLOW_SCALE);
    const start = game.paddle.x;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.paddle.x).toBeCloseTo(start + PADDLE_SPEED * 0.2);
  });

  it("restores level speed when the timer expires", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.SLOW);
    step(game, 11);
    expect(game.effects.slow).toBe(0);
    expect(game.ball.speed).toBeCloseTo(speedForLevel(1));
  });
});
