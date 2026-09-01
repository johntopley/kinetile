import {
  FIXED_DT,
  HEIGHT,
  INITIAL_LIVES,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  PLAYFIELD_TOP,
  STATES
} from "./constants.js";
import { createBall, integrateBall, placeBallOnPaddle, serveBall } from "./ball.js";
import { createFixedWall, remainingBricks } from "./bricks.js";
import { createInput } from "./input.js";
import { createPaddle, updatePaddle } from "./paddle.js";
import {
  ballHasFallen,
  collideBallWithBricks,
  collideBallWithPaddle,
  collideBallWithWalls,
  hitBrick
} from "./physics.js";

export function createGame(options = {}) {
  const paddle = createPaddle();
  const ball = createBall();
  placeBallOnPaddle(ball, paddle);

  return {
    state: STATES.TITLE,
    lives: INITIAL_LIVES,
    paddle,
    ball,
    bricks: createFixedWall(),
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

export function rebuildWall(game) {
  game.bricks = createFixedWall();
}

export function startServe(game, resetPaddle = true) {
  game.state = STATES.SERVE;
  if (resetPaddle) {
    game.paddle = createPaddle();
  }
  game.ball = createBall(game.ball.speed);
  placeBallOnPaddle(game.ball, game.paddle);
}

export function startMatch(game) {
  game.lives = INITIAL_LIVES;
  rebuildWall(game);
  startServe(game, true);
}

export function launchBall(game, angle) {
  game.state = STATES.PLAYING;
  serveBall(game.ball, angle);
}

export function loseLife(game) {
  game.lives -= 1;
  if (game.lives <= 0) {
    game.lives = 0;
    game.state = STATES.GAME_OVER;
    return;
  }
  game.state = STATES.LIFE_LOST;
}

export function clearLevel(game) {
  game.state = STATES.LEVEL_CLEAR;
}

export function step(game, dt) {
  if (game.state === STATES.TITLE) {
    if (game.input.consumeAction()) {
      startMatch(game);
    }
    return;
  }

  if (game.state === STATES.GAME_OVER) {
    if (game.input.consumeAction() || game.input.consumeEscape()) {
      game.state = STATES.TITLE;
    }
    return;
  }

  if (game.state === STATES.LEVEL_CLEAR) {
    if (game.input.consumeAction()) {
      rebuildWall(game);
      startServe(game, false);
    }
    return;
  }

  if (game.state === STATES.LIFE_LOST) {
    if (game.input.consumeAction()) {
      startServe(game, false);
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
    const brick = collideBallWithBricks(game.ball, game.bricks);
    if (brick) {
      hitBrick(brick);
      if (remainingBricks(game.bricks).length === 0) {
        clearLevel(game);
      }
    }
    if (game.state === STATES.PLAYING && ballHasFallen(game.ball, game.playfield.bottom)) {
      loseLife(game);
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
