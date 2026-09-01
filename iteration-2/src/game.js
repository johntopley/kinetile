import {
  FIXED_DT,
  HEIGHT,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  PLAYFIELD_TOP,
  STATES
} from "./constants.js";
import { createBall, integrateBall, placeBallOnPaddle, serveBall } from "./ball.js";
import { createInput } from "./input.js";
import { createPaddle, updatePaddle } from "./paddle.js";
import { ballHasFallen, collideBallWithPaddle, collideBallWithWalls } from "./physics.js";

export function createGame(options = {}) {
  const paddle = createPaddle();
  const ball = createBall();
  placeBallOnPaddle(ball, paddle);

  return {
    state: STATES.TITLE,
    paddle,
    ball,
    input: options.input ?? createInput(),
    playfield: {
      left: PLAYFIELD_LEFT,
      right: PLAYFIELD_RIGHT,
      top: PLAYFIELD_TOP,
      bottom: HEIGHT
    },
    accumulator: 0
  };
}

export function startServe(game) {
  game.state = STATES.SERVE;
  game.paddle = createPaddle();
  game.ball = createBall(game.ball.speed);
  placeBallOnPaddle(game.ball, game.paddle);
}

export function launchBall(game, angle) {
  game.state = STATES.PLAYING;
  serveBall(game.ball, angle);
}

export function step(game, dt) {
  if (game.state === STATES.TITLE) {
    if (game.input.consumeAction()) {
      startServe(game);
    }
    return;
  }

  if (game.state === STATES.SERVE) {
    updatePaddle(game.paddle, game.input, dt, game.playfield);
    placeBallOnPaddle(game.ball, game.paddle);
    if (game.input.consumeAction()) {
      launchBall(game);
    }
    return;
  }

  if (game.state === STATES.PLAYING) {
    updatePaddle(game.paddle, game.input, dt, game.playfield);
    integrateBall(game.ball, dt);
    collideBallWithWalls(game.ball, game.playfield);
    collideBallWithPaddle(game.ball, game.paddle);
    if (ballHasFallen(game.ball, game.playfield.bottom)) {
      startServe(game);
    }
  }
}

export function advance(game, elapsed) {
  game.accumulator += elapsed;
  while (game.accumulator >= FIXED_DT) {
    step(game, FIXED_DT);
    game.accumulator -= FIXED_DT;
  }
}
