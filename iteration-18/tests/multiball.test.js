import { describe, expect, it } from "vitest";
import { MAX_BALLS, POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, launchBall, startMatch, step } from "../src/game.js";
import { applyPowerUp, spawnExtraBalls } from "../src/powerups.js";

describe("multi-ball", () => {
  it("spawns two extra balls that are not timed", () => {
    const game = createGame();
    startMatch(game);
    launchBall(game);
    applyPowerUp(game, POWERUP_TYPES.MULTI);
    expect(game.balls).toHaveLength(3);
    expect(game.effects.wide).toBe(0);
    expect(game.effects.laser).toBe(0);
    expect(game.effects.pierce).toBe(0);
    step(game, 1);
    expect(game.balls.length).toBeGreaterThan(1);
  });

  it("only loses a life when the last ball falls", () => {
    const game = createGame();
    startMatch(game);
    launchBall(game);
    applyPowerUp(game, POWERUP_TYPES.MULTI);
    game.balls[0].y = 900;
    game.balls[0].vy = 400;
    game.balls[1].y = 200;
    game.balls[1].vy = -10;
    game.balls[2].y = 200;
    game.balls[2].vy = -10;
    step(game, 0);
    expect(game.balls).toHaveLength(2);
    expect(game.state).toBe(STATES.PLAYING);
    expect(game.lives).toBe(3);
  });

  it("caps the number of balls", () => {
    const game = createGame();
    startMatch(game);
    launchBall(game);
    spawnExtraBalls(game);
    spawnExtraBalls(game);
    spawnExtraBalls(game);
    expect(game.balls.length).toBeLessThanOrEqual(MAX_BALLS);
  });

  it("queues a split if the capsule is caught on serve", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.MULTI);
    expect(game.pendingMulti).toBe(true);
    expect(game.balls).toHaveLength(1);
    launchBall(game);
    expect(game.balls).toHaveLength(3);
  });
});
