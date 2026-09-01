import { describe, expect, it } from "vitest";
import { POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { applyPowerUp } from "../src/powerups.js";

describe("catch", () => {
  it("sticks a descending ball to the bat", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.CATCH);
    game.ball.x = game.paddle.x;
    game.ball.y = game.paddle.y - game.paddle.height / 2 - game.ball.radius + 1;
    game.ball.vx = 0;
    game.ball.vy = 200;
    step(game, 0);
    expect(game.ball.stuck).toBe(true);
    expect(game.ball.vy).toBe(0);
  });

  it("carries a stuck ball with the bat", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.CATCH);
    game.ball.stuck = true;
    game.ball.catchOffset = 0;
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.ball.x).toBeCloseTo(game.paddle.x);
    expect(game.ball.stuck).toBe(true);
  });

  it("releases on Space and when the timer expires", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.CATCH);
    game.ball.stuck = true;
    game.ball.catchOffset = 12;
    input.press("Space");
    step(game, 0);
    expect(game.ball.stuck).toBe(false);
    expect(game.ball.vy).toBeLessThan(0);

    applyPowerUp(game, POWERUP_TYPES.CATCH);
    game.ball.stuck = true;
    step(game, 11);
    expect(game.effects.catch).toBe(0);
    expect(game.ball.stuck).toBe(false);
  });
});
