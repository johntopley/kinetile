import {
  DEFAULT_SEED,
  FIXED_DT,
  HEIGHT,
  INITIAL_LIVES,
  LASER_COOLDOWN,
  NAME_LENGTH,
  PLAYFIELD_LEFT,
  PLAYFIELD_RIGHT,
  PLAYFIELD_TOP,
  STATES
} from "./constants.js";
import { createSilentAudio } from "./audio.js";
import { createBall, integrateBall, placeBallOnPaddle, serveBall } from "./ball.js";
import { remainingBricks, tickBrickTweens, tryShiftBrick } from "./bricks.js";
import { createInput } from "./input.js";
import { speedForLevel, wallForLevel } from "./levels.js";
import { collideMissilesWithBricks, fireLasers, updateMissiles } from "./missiles.js";
import { createPaddle, updatePaddle } from "./paddle.js";
import {
  applyPowerUp,
  collectPowerUps,
  createEmptyEffects,
  maybeDropPowerUp,
  motionScale,
  resetEffects,
  spawnExtraBalls,
  tickEffects,
  updatePowerUps
} from "./powerups.js";
import { mulberry32 } from "./rng.js";
import {
  ballHasFallen,
  collideBallWithBricks,
  collideBallWithPaddle,
  collideBallWithWalls,
  hitBrick
} from "./physics.js";
import {
  createMemoryStorage,
  insertScore,
  loadScores,
  qualifies,
  saveScores,
  scoreForBrick
} from "./scores.js";

export function createGame(options = {}) {
  const seed = options.seed ?? DEFAULT_SEED;
  const storage = options.storage ?? createMemoryStorage();
  const paddle = createPaddle();
  const ball = createBall();
  placeBallOnPaddle(ball, paddle);

  return {
    state: STATES.TITLE,
    lives: INITIAL_LIVES,
    level: 1,
    score: 0,
    nameEntry: "",
    seed,
    storage,
    scores: loadScores(storage),
    paddle,
    ball,
    balls: [ball],
    pendingMulti: false,
    bricks: wallForLevel(seed, 1),
    powerUps: [],
    missiles: [],
    fireCooldown: 0,
    effects: createEmptyEffects(),
    dropRng: options.dropRng ?? mulberry32(seed ^ 0xa5a5a5),
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
  game.balls = [game.ball];
  game.pendingMulti = false;
  placeBallOnPaddle(game.ball, game.paddle);
}

export function startMatch(game) {
  game.lives = INITIAL_LIVES;
  game.score = 0;
  game.nameEntry = "";
  resetEffects(game);
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
  if (game.pendingMulti) {
    game.pendingMulti = false;
    spawnExtraBalls(game);
  }
}

export function finishMatch(game) {
  cue(game, "over");
  if (qualifies(game.scores, game.score)) {
    game.state = STATES.HIGH_SCORE_ENTRY;
    game.nameEntry = "";
    return;
  }
  game.state = STATES.GAME_OVER;
}

export function loseLife(game) {
  game.lives -= 1;
  if (game.lives <= 0) {
    game.lives = 0;
    finishMatch(game);
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

export function commitHighScore(game) {
  const name = (game.nameEntry || "AAA").toUpperCase().padEnd(NAME_LENGTH, "A").slice(0, NAME_LENGTH);
  game.scores = insertScore(game.scores, { name, score: game.score });
  saveScores(game.storage, game.scores);
  game.state = STATES.GAME_OVER;
}

function stepNameEntry(game) {
  if (game.input.consumeBackspace()) {
    game.nameEntry = game.nameEntry.slice(0, -1);
  }

  let letter = game.input.consumeLetter();
  while (letter) {
    if (game.nameEntry.length < NAME_LENGTH) {
      game.nameEntry += letter;
    }
    letter = game.input.consumeLetter();
  }

  if (game.input.consumeAction() && game.nameEntry.length > 0) {
    commitHighScore(game);
  }
}

export function step(game, dt) {
  if (game.state === STATES.TITLE) {
    if (game.input.consumeAction()) {
      startMatch(game);
    }
    return;
  }

  if (game.state === STATES.HIGH_SCORE_ENTRY) {
    stepNameEntry(game);
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

  if (game.state === STATES.SERVE || game.state === STATES.PLAYING) {
    tickEffects(game, dt);
    const motionDt = dt * motionScale(game);
    tickBrickTweens(game.bricks, motionDt);
    updateFallingPowerUps(game, motionDt);
    updateMotion(game, motionDt);
    return;
  }
}

function updateMotion(game, dt) {
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
    const live = [];
    for (const ball of game.balls) {
      integrateBall(ball, dt);
      if (collideBallWithWalls(ball, game.playfield)) {
        cue(game, "wall");
      }
      if (collideBallWithPaddle(ball, game.paddle)) {
        cue(game, "paddle");
      }
      const brick = collideBallWithBricks(ball, game.bricks, {
        pierce: game.effects.pierce > 0
      });
      if (brick) {
        destroyBrick(game, brick, true);
      }
      if (!ballHasFallen(ball, game.playfield.bottom)) {
        live.push(ball);
      }
    }
    game.balls = live;
    game.ball = game.balls[0];
    updateLaserFire(game, dt);
    if (game.state === STATES.PLAYING && game.balls.length === 0) {
      loseLife(game);
    }
  }
}

function destroyBrick(game, brick, bounced) {
  if (tryShiftBrick(brick, game.bricks, game.dropRng)) {
    cue(game, bounced ? "brick" : "laser");
    return;
  }
  const destroyed = hitBrick(brick);
  cue(game, bounced ? "brick" : "laser");
  if (destroyed) {
    game.score += scoreForBrick(brick);
    const drop = maybeDropPowerUp(game.dropRng, brick);
    if (drop) {
      game.powerUps.push(drop);
    }
  }
  if (remainingBricks(game.bricks).length === 0) {
    clearLevel(game);
  }
}

function updateLaserFire(game, dt) {
  game.fireCooldown = Math.max(0, game.fireCooldown - dt);
  if (game.effects.laser > 0 && game.input.consumeAction() && game.fireCooldown === 0) {
    game.missiles.push(...fireLasers(game.paddle));
    game.fireCooldown = LASER_COOLDOWN;
    cue(game, "laser");
  }
  game.missiles = updateMissiles(game.missiles, dt);
  const { remaining, hits } = collideMissilesWithBricks(game.missiles, game.bricks);
  game.missiles = remaining;
  for (const brick of hits) {
    if (brick.alive) {
      destroyBrick(game, brick, false);
    }
  }
}

function updateFallingPowerUps(game, dt) {
  game.powerUps = updatePowerUps(game.powerUps, dt, game.playfield.bottom);
  const { collected, remaining } = collectPowerUps(game.powerUps, game.paddle);
  game.powerUps = remaining;
  for (const item of collected) {
    applyPowerUp(game, item.type);
    cue(game, "power");
  }
}

export function advance(game, elapsed) {
  game.accumulator += elapsed;
  while (game.accumulator >= FIXED_DT) {
    step(game, FIXED_DT);
    game.accumulator -= FIXED_DT;
  }
}
