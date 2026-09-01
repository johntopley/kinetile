import { describe, expect, it } from "vitest";
import {
  INITIAL_LIVES,
  POWERUP_TYPES,
  STATES,
  WIDTH
} from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("twin bat", () => {
  it("bounces a ball that strikes the mirrored bat", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.TWIN);
    game.paddle.x = 220;
    game.ball.x = WIDTH - 220;
    game.ball.y = game.paddle.y - game.paddle.height / 2 - game.ball.radius + 1;
    game.ball.vx = 0;
    game.ball.vy = 200;
    step(game, 0);
    expect(game.ball.vy).toBeLessThan(0);
  });

  it("collects a capsule that overlaps the twin", () => {
    const game = createGame();
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.TWIN);
    game.paddle.x = 200;
    game.powerUps.push({
      type: POWERUP_TYPES.PLAYER,
      x: WIDTH - 200,
      y: game.paddle.y,
      width: 36,
      height: 16,
      vy: 0
    });
    step(game, 0);
    expect(game.powerUps).toHaveLength(0);
    expect(game.lives).toBe(INITIAL_LIVES + 1);
  });
});
