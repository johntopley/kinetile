import { describe, expect, it } from "vitest";
import { POWERUP_TYPES, STATES } from "../src/constants.js";
import { createBrick } from "../src/bricks.js";
import { createGame, startMatch, step } from "../src/game.js";
import { applyPowerUp } from "../src/powerups.js";

describe("fireball", () => {
  it("chips orthogonal neighbours without reversing the ball", () => {
    const game = createGame({ seed: 1, dropRng: () => 1 });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.FIREBALL);
    const centre = createBrick(3, 3, { hits: 2, maxHits: 2 });
    const right = createBrick(4, 3, { hits: 2, maxHits: 2 });
    game.bricks = [centre, right];
    game.ball.x = centre.x + centre.width / 2;
    game.ball.y = centre.y + centre.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(centre.hits).toBe(1);
    expect(right.hits).toBe(1);
    expect(game.ball.vy).toBe(-200);
  });
});
