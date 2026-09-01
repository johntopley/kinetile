import { describe, expect, it } from "vitest";
import { POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

function aimAt(game, brick) {
  game.ball.x = brick.x + brick.width / 2;
  game.ball.y = brick.y + brick.height + game.ball.radius - 1;
  game.ball.vx = 0;
  game.ball.vy = -200;
}

describe("pierce", () => {
  it("destroys a brick without reversing the ball", () => {
    const game = createGame({ seed: 1 });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.PIERCE);
    const brick = game.bricks[0];
    for (const item of game.bricks) {
      item.alive = item === brick;
    }
    aimAt(game, brick);
    step(game, 0);
    expect(brick.alive).toBe(false);
    expect(game.ball.vy).toBe(-200);
  });

  it("reflects again after the pierce timer expires", () => {
    const game = createGame({ seed: 1 });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.PIERCE);
    step(game, 11);
    game.state = STATES.PLAYING;
    const brick = game.bricks[0];
    for (const item of game.bricks) {
      item.alive = item === brick;
    }
    aimAt(game, brick);
    step(game, 0);
    expect(brick.alive).toBe(false);
    expect(game.ball.vy).toBeGreaterThan(0);
  });
});
