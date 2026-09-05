import { describe, expect, it } from "vitest";
import { HEIGHT, MIN_VERTICAL_RATIO, POWERUP_TYPES, STATES, WIDTH } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("magnet", () => {
  it("pulls a low ball toward the bat", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.MAGNET);
    game.paddle.x = WIDTH / 2;
    game.ball.x = WIDTH / 2 - 80;
    game.ball.y = HEIGHT - 140;
    game.ball.vx = 0;
    game.ball.vy = 80;
    const startX = game.ball.x;
    step(game, 0.2);
    expect(game.ball.x).toBeGreaterThan(startX);
  });

  it("does not flatten a shallow path into a horizontal lock", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.MAGNET);
    game.paddle.x = WIDTH / 2;
    game.ball.x = WIDTH / 2 - 60;
    game.ball.y = HEIGHT - 140;
    game.ball.vx = 350;
    game.ball.vy = 12;
    step(game, 0.4);
    expect(Math.abs(game.ball.vy)).toBeGreaterThanOrEqual(
      game.ball.speed * MIN_VERTICAL_RATIO - 1e-6
    );
  });
});
