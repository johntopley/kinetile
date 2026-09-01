import { describe, expect, it } from "vitest";
import { FIXED_DT, STATES, WIDTH } from "../src/constants.js";
import { createGame, launchBall, startServe, step } from "../src/game.js";
import { createInput } from "../src/input.js";

describe("game", () => {
  it("starts on the title screen", () => {
    const game = createGame();
    expect(game.state).toBe(STATES.TITLE);
  });

  it("enters serve from the title screen", () => {
    const input = createInput();
    const game = createGame({ input });
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.SERVE);
    expect(game.ball.x).toBe(game.paddle.x);
    expect(game.ball.vx).toBe(0);
  });

  it("keeps the ball on the bat while serving", () => {
    const input = createInput();
    const game = createGame({ input });
    startServe(game);
    input.press("ArrowRight");
    step(game, 0.2);
    expect(game.ball.x).toBe(game.paddle.x);
    expect(game.paddle.x).toBeGreaterThan(WIDTH / 2);
  });

  it("launches the ball from serve", () => {
    const input = createInput();
    const game = createGame({ input });
    startServe(game);
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.PLAYING);
    expect(game.ball.vy).toBeLessThan(0);
  });

  it("returns to serve when the ball is missed", () => {
    const game = createGame();
    launchBall(game);
    game.ball.x = 200;
    game.ball.y = 900;
    game.ball.vx = 0;
    game.ball.vy = 400;
    step(game, 1);
    expect(game.state).toBe(STATES.SERVE);
  });
});
