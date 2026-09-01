import { describe, expect, it } from "vitest";
import { FIXED_DT, INITIAL_LIVES, STATES, WIDTH } from "../src/constants.js";
import { createGame, launchBall, loseLife, startMatch, startServe, step } from "../src/game.js";
import { createInput } from "../src/input.js";

describe("game", () => {
  it("starts on the title screen", () => {
    const game = createGame();
    expect(game.state).toBe(STATES.TITLE);
    expect(game.lives).toBe(INITIAL_LIVES);
  });

  it("enters serve from the title screen with a full set of lives", () => {
    const input = createInput();
    const game = createGame({ input });
    game.lives = 1;
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.SERVE);
    expect(game.lives).toBe(INITIAL_LIVES);
    expect(game.ball.x).toBe(game.paddle.x);
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

  it("loses a life and pauses when the ball is missed", () => {
    const game = createGame();
    startMatch(game);
    launchBall(game);
    game.ball.x = 200;
    game.ball.y = 900;
    game.ball.vx = 0;
    game.ball.vy = 400;
    step(game, 1);
    expect(game.lives).toBe(INITIAL_LIVES - 1);
    expect(game.state).toBe(STATES.LIFE_LOST);
  });

  it("returns to serve after a lost life is acknowledged", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    loseLife(game);
    expect(game.state).toBe(STATES.LIFE_LOST);
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.SERVE);
  });

  it("ends the match on the final miss", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    game.lives = 1;
    launchBall(game);
    game.ball.y = 900;
    game.ball.vx = 0;
    game.ball.vy = 400;
    step(game, 1);
    expect(game.lives).toBe(0);
    expect(game.state).toBe(STATES.GAME_OVER);

    input.press("Escape");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.TITLE);
  });
});
