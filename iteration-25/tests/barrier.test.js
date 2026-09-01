import { describe, expect, it } from "vitest";
import { BARRIER_Y, INITIAL_LIVES, POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("barrier", () => {
  it("saves one miss and then lets the next one through", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.BARRIER);
    expect(game.barrier).toBe(1);
    game.ball.x = 200;
    game.ball.y = BARRIER_Y - game.ball.radius + 1;
    game.ball.vx = 0;
    game.ball.vy = 300;
    step(game, 0);
    expect(game.barrier).toBe(0);
    expect(game.lives).toBe(INITIAL_LIVES);
    expect(game.ball.vy).toBeLessThan(0);
    expect(game.state).toBe(STATES.PLAYING);

    game.ball.y = 900;
    game.ball.vy = 400;
    step(game, 0);
    expect(game.state).toBe(STATES.LIFE_LOST);
    expect(game.lives).toBe(INITIAL_LIVES - 1);
  });
});
