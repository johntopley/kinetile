import {
  FIXED_DT,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  STATES
} from "./constants.js";
import { createInput } from "./input.js";
import { createPaddle, updatePaddle } from "./paddle.js";

export function createGame(options = {}) {
  return {
    state: STATES.TITLE,
    paddle: createPaddle(),
    input: options.input ?? createInput(),
    playfield: {
      left: PLAYFIELD_LEFT,
      right: PLAYFIELD_RIGHT
    },
    accumulator: 0
  };
}

export function startPlay(game) {
  game.state = STATES.PLAYING;
  game.paddle = createPaddle();
}

export function step(game, dt) {
  if (game.state === STATES.TITLE) {
    if (game.input.consumeAction()) {
      startPlay(game);
    }
    return;
  }

  if (game.state === STATES.PLAYING) {
    updatePaddle(game.paddle, game.input, dt, game.playfield);
  }
}

export function advance(game, elapsed) {
  game.accumulator += elapsed;
  while (game.accumulator >= FIXED_DT) {
    step(game, FIXED_DT);
    game.accumulator -= FIXED_DT;
  }
}
