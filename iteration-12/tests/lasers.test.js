import { describe, expect, it } from "vitest";
import { LASER_COOLDOWN, POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { applyPowerUp } from "../src/powerups.js";

describe("lasers", () => {
  it("fires twin missiles while the laser effect is active", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.LASER);
    input.press("Space");
    step(game, 0);
    expect(game.missiles).toHaveLength(2);
    expect(game.fireCooldown).toBe(LASER_COOLDOWN);
  });

  it("does not fire again before the cooldown elapses", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    game.state = STATES.PLAYING;
    applyPowerUp(game, POWERUP_TYPES.LASER);
    input.press("Space");
    step(game, 0);
    input.press("Space");
    step(game, 0.1);
    expect(game.missiles).toHaveLength(2);
  });

  it("destroys a brick a missile overlaps", () => {
    const game = createGame();
    startMatch(game);
    game.state = STATES.PLAYING;
    const brick = game.bricks[0];
    for (const item of game.bricks) {
      item.alive = item === brick;
    }
    game.missiles.push({
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2,
      width: 4,
      height: 16,
      vy: 0
    });
    step(game, 0);
    expect(brick.alive).toBe(false);
    expect(game.score).toBeGreaterThan(0);
    expect(game.missiles).toHaveLength(0);
  });

  it("cannot fire after the laser timer expires", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.LASER);
    step(game, 11);
    game.state = STATES.PLAYING;
    input.press("Space");
    step(game, 0);
    expect(game.effects.laser).toBe(0);
    expect(game.missiles).toHaveLength(0);
  });
});
