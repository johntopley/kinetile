import { describe, expect, it } from "vitest";
import { STATES } from "../src/constants.js";
import { createBrick } from "../src/bricks.js";
import { createGame, startMatch, step } from "../src/game.js";
import { hitBrick } from "../src/physics.js";
import { scoreForBrick } from "../src/scores.js";

describe("multi-hit bricks", () => {
  it("survives the first hit and dies on the last", () => {
    const brick = createBrick(2, 0, { hits: 2, maxHits: 2 });
    expect(hitBrick(brick)).toBe(false);
    expect(brick.alive).toBe(true);
    expect(brick.hits).toBe(1);
    expect(hitBrick(brick)).toBe(true);
    expect(brick.alive).toBe(false);
  });

  it("scores only when the brick is finally removed", () => {
    const game = createGame({ seed: 1 });
    startMatch(game);
    game.state = STATES.PLAYING;
    const brick = createBrick(3, 1, { hits: 2, maxHits: 2 });
    game.bricks = [brick];
    game.ball.x = brick.x + brick.width / 2;
    game.ball.y = brick.y + brick.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(brick.alive).toBe(true);
    expect(game.score).toBe(0);

    game.ball.x = brick.x + brick.width / 2;
    game.ball.y = brick.y + brick.height + game.ball.radius - 1;
    game.ball.vy = -200;
    step(game, 0);
    expect(brick.alive).toBe(false);
    expect(game.score).toBe(scoreForBrick(brick));
  });
});
