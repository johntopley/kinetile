import {
  DEFAULT_SEED,
  FIXED_DT,
  HEIGHT,
  INITIAL_LIVES,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  PLAYFIELD_TOP,
  STATES
} from "./constants.js";
import { createSilentAudio } from "./audio.js";
import { createBall, integrateBall, placeBallOnPaddle, serveBall } from "./ball.js";
import { remainingBricks } from "./bricks.js";
import { createInput } from "./input.js";
import { speedForLevel, wallForLevel } from "./levels.js";
import { createPaddle, updatePaddle } from "./paddle.js";
import {
  ballHasFallen,
  collideBallWithBricks,
  collideBallWithPaddle,
  collideBallWithWalls,
  hitBrick
} from "./physics.js";

export function createGame(options = {}) {
  const seed = options.seed ?? DEFAULT_SEED;
  const paddle = createPaddle();
  const ball = createBall();
  placeBallOnPaddle(ball, paddle);

  return {
    state: STATES.TITLE,
    lives: INITIAL_LIVES,
    level: 1,
    seed,
    paddle,
    ball,
    bricks: wallForLevel(seed, 1),
    audio: options.audio ?? createSilentAudio(),
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

export function loadLevel(game, level) {
  game.level = level;
  game.bricks = wallForLevel(game.seed, level);
  game.ball = createBall(speedForLevel(level));
}

export function startServe(game, resetPaddle = true) {
  game.state = STATES.SERVE;
  if (resetPaddle) {
    game.paddle = createPaddle();
  }
  game.ball = createBall(speedForLevel(game.level));
  placeBallOnPaddle(game.ball, game.paddle);
}

export function startMatch(game) {
  game.lives = INITIAL_LIVES;
  loadLevel(game, 1);
  startServe(game, true);
}

function cue(game, name) {
  game.audio.play(name);
}

export function launchBall(game, angle) {
  game.state = STATES.PLAYING;
  serveBall(game.ball, angle);
  cue(game, "serve");
}

export function loseLife(game) {
  game.lives -= 1;
  if (game.lives <= 0) {
    game.lives = 0;
    game.state = STATES.GAME_OVER;
    cue(game, "over");
    return;
  }
  game.state = STATES.LIFE_LOST;
  cue(game, "life");
}

export function clearLevel(game) {
  game.state = STATES.LEVEL_CLEAR;
  cue(game, "clear");
}

export function beginNextLevel(game) {
  loadLevel(game, game.level + 1);
  startServe(game, false);
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
      beginNextLevel(game);
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
    if (collideBallWithWalls(game.ball, game.playfield)) {
      cue(game, "wall");
    }
    if (collideBallWithPaddle(game.ball, game.paddle)) {
      cue(game, "paddle");
    }
    const brick = collideBallWithBricks(game.ball, game.bricks);
    if (brick) {
      hitBrick(brick);
      cue(game, "brick");
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
