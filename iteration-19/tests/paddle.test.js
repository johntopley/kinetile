import { describe, expect, it } from "vitest";
import {
  PADDLE_SPEED,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  WIDTH
} from "../src/constants.js";
import { createInput } from "../src/input.js";
import { clampPaddle, createPaddle, updatePaddle } from "../src/paddle.js";

const playfield = {
  left: PLAYFIELD_LEFT,
  right: PLAYFIELD_RIGHT
};

describe("paddle", () => {
  it("starts centred on the playfield", () => {
    const paddle = createPaddle();
    expect(paddle.x).toBe(WIDTH / 2);
  });

  it("moves left and right at the configured speed", () => {
    const paddle = createPaddle();
    const input = createInput();
    const start = paddle.x;

    input.press("ArrowRight");
    updatePaddle(paddle, input, 0.5, playfield);
    expect(paddle.x).toBeCloseTo(start + PADDLE_SPEED * 0.5);

    input.release("ArrowRight");
    input.press("KeyA");
    updatePaddle(paddle, input, 0.25, playfield);
    expect(paddle.x).toBeCloseTo(start + PADDLE_SPEED * 0.25);
  });

  it("cancels opposing left and right input", () => {
    const paddle = createPaddle();
    const input = createInput();
    const start = paddle.x;

    input.press("ArrowLeft");
    input.press("ArrowRight");
    updatePaddle(paddle, input, 1, playfield);
    expect(paddle.x).toBe(start);
    expect(paddle.vx).toBe(0);
  });

  it("clamps against the side walls", () => {
    const paddle = createPaddle();
    paddle.x = playfield.left;
    clampPaddle(paddle, playfield);
    expect(paddle.x).toBe(playfield.left + paddle.width / 2);

    paddle.x = playfield.right;
    clampPaddle(paddle, playfield);
    expect(paddle.x).toBe(playfield.right - paddle.width / 2);
  });
});
