import { describe, expect, it } from "vitest";
import { BRICK_OFFSET_X, BRICK_OFFSET_Y, BRICK_WIDTH, SHIFT_TWEEN, STATES } from "../src/constants.js";
import { adjacentVacancies, createBrick, shiftBrick, tryShiftBrick } from "../src/bricks.js";
import { createGame, startMatch, step } from "../src/game.js";

describe("shifting bricks", () => {
  it("lists orthogonal empty neighbours", () => {
    const brick = createBrick(1, 1);
    const neighbour = createBrick(2, 1);
    const spots = adjacentVacancies(brick, [brick, neighbour]);
    expect(spots).toEqual(
      expect.arrayContaining([
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 1, row: 2 }
      ])
    );
    expect(spots).not.toContainEqual({ col: 2, row: 1 });
  });

  it("slides into a vacancy on the first hit", () => {
    const game = createGame({ seed: 1, dropRng: () => 0 });
    startMatch(game);
    game.state = STATES.PLAYING;
    const brick = createBrick(1, 1, { shifting: true });
    game.bricks = [brick];
    game.ball.x = brick.x + brick.width / 2;
    game.ball.y = brick.y + brick.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(brick.alive).toBe(true);
    expect(brick.shifted).toBe(true);
    expect(brick.col).toBe(2);
    expect(brick.x).toBe(BRICK_OFFSET_X + 2 * BRICK_WIDTH);
    expect(brick.shiftTween).toBe(SHIFT_TWEEN);
    expect(game.score).toBe(0);
  });

  it("settles in place when every neighbour is taken", () => {
    const brick = createBrick(0, 0, { shifting: true });
    const blockers = [
      createBrick(1, 0),
      createBrick(0, 1)
    ];
    const moved = tryShiftBrick(brick, [brick, ...blockers], () => 0);
    expect(moved).toBe(true);
    expect(brick.shifted).toBe(true);
    expect(brick.col).toBe(0);
    expect(brick.row).toBe(0);
  });

  it("dies on the second hit after shifting", () => {
    const brick = createBrick(1, 1, { shifting: true });
    shiftBrick(brick, { col: 2, row: 1 });
    const game = createGame({ seed: 1 });
    startMatch(game);
    game.state = STATES.PLAYING;
    game.bricks = [brick];
    game.ball.x = brick.x + brick.width / 2;
    game.ball.y = brick.y + brick.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(brick.alive).toBe(false);
    expect(game.score).toBeGreaterThan(0);
  });

  it("counts the tween down", () => {
    const brick = createBrick(1, 1, { shifting: true });
    shiftBrick(brick, { col: 2, row: 1 });
    const game = createGame();
    startMatch(game);
    game.bricks = [brick, ...game.bricks];
    step(game, SHIFT_TWEEN);
    expect(brick.shiftTween).toBe(0);
    expect(brick.y).toBe(BRICK_OFFSET_Y + 1 * 24);
  });
});
