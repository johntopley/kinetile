import { describe, expect, it } from "vitest";
import { FIXED_DT, PADDLE_SPEED, STATES, WIDTH } from "../src/constants.js";
import { advance, createGame, step } from "../src/game.js";
import { createInput } from "../src/input.js";

describe("game", () => {
  it("starts on the title screen", () => {
    const game = createGame();
    expect(game.state).toBe(STATES.TITLE);
  });

  it("enters play when an action key is pressed", () => {
    const input = createInput();
    const game = createGame({ input });
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.PLAYING);
    expect(game.paddle.x).toBe(WIDTH / 2);
  });

  it("does not move the bat on the title screen", () => {
    const input = createInput();
    const game = createGame({ input });
    input.press("ArrowRight");
    step(game, 1);
    expect(game.paddle.x).toBe(WIDTH / 2);
  });

  it("advances play in fixed-size ticks", () => {
    const input = createInput();
    const game = createGame({ input });
    input.press("Enter");
    step(game, FIXED_DT);

    input.press("ArrowRight");
    const start = game.paddle.x;
    advance(game, FIXED_DT * 3 + FIXED_DT / 2);
    expect(game.paddle.x).toBeCloseTo(start + PADDLE_SPEED * FIXED_DT * 3);
    expect(game.accumulator).toBeCloseTo(FIXED_DT / 2);
  });
});
