import { describe, expect, it } from "vitest";
import {
  PADDLE_WIDTH,
  POWERUP_DURATION,
  POWERUP_TYPES,
  STATES,
  WIDE_PADDLE_WIDTH
} from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp, maybeDropPowerUp } from "../src/powerups.js";

function alwaysDrop() {
  return 0;
}

describe("power-ups", () => {
  it("drops a wide capsule when the RNG cooperates", () => {
    const brick = { x: 100, y: 80, width: 62, height: 22 };
    const drop = maybeDropPowerUp(alwaysDrop, brick);
    expect(drop).not.toBeNull();
    expect(drop.type).toBe(POWERUP_TYPES.WIDE);
    expect(drop.x).toBe(131);
  });

  it("spawns a capsule when a brick is destroyed", () => {
    const game = createGame({ seed: 1, dropRng: alwaysDrop });
    startMatch(game);
    game.state = STATES.PLAYING;
    for (const brick of game.bricks) {
      brick.alive = false;
    }
    const last = game.bricks[0];
    last.alive = true;
    game.ball.x = last.x + last.width / 2;
    game.ball.y = last.y + last.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(game.powerUps).toHaveLength(1);
    expect(game.powerUps[0].type).toBe(POWERUP_TYPES.WIDE);
  });

  it("widens the bat for ten seconds and then restores it", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.WIDE);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
    expect(game.effects.wide).toBe(POWERUP_DURATION);

    step(game, 4);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
    step(game, 7);
    expect(game.effects.wide).toBe(0);
    expect(game.paddle.width).toBe(PADDLE_WIDTH);
  });

  it("refreshes the timer when another wide capsule is caught", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.WIDE);
    step(game, 6);
    applyPowerUp(game, POWERUP_TYPES.WIDE);
    expect(game.effects.wide).toBe(POWERUP_DURATION);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
  });

  it("collects a capsule that overlaps the bat", () => {
    const game = createGame();
    startMatch(game);
    game.powerUps.push({
      type: POWERUP_TYPES.WIDE,
      x: game.paddle.x,
      y: game.paddle.y,
      width: 36,
      height: 16,
      vy: 0
    });
    step(game, 0);
    expect(game.powerUps).toHaveLength(0);
    expect(game.paddle.width).toBe(WIDE_PADDLE_WIDTH);
    expect(game.audio.events).toContain("power");
  });
});
