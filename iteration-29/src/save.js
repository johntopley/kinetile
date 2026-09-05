import { SAVE_KEY, SAVE_VERSION, STATES } from "./constants.js";
import { mulberry32 } from "./rng.js";

const PLAY_STATES = new Set([STATES.SERVE, STATES.PLAYING]);

export function canPause(state) {
  return PLAY_STATES.has(state);
}

export function titleCaptions(hasSave) {
  const lines = ["Press Space or Enter to begin"];
  if (hasSave) {
    lines.push("C to continue a saved game");
  }
  lines.push("P pauses  ·  S saves while paused  ·  Esc returns to the title");
  return lines;
}

export function pauseCaptions(saved) {
  const lines = [];
  if (saved) {
    lines.push("Game saved");
  }
  lines.push("P or Space to resume");
  lines.push("S to save");
  lines.push("Escape for the title screen");
  return lines;
}

export function rngStateOf(rng) {
  if (typeof rng?.getState === "function") {
    return rng.getState();
  }
  return null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validBall(ball) {
  return ball
    && isFiniteNumber(ball.x)
    && isFiniteNumber(ball.y)
    && isFiniteNumber(ball.radius)
    && isFiniteNumber(ball.vx)
    && isFiniteNumber(ball.vy)
    && isFiniteNumber(ball.speed);
}

function validBrick(brick) {
  return brick
    && isFiniteNumber(brick.col)
    && isFiniteNumber(brick.row)
    && isFiniteNumber(brick.x)
    && isFiniteNumber(brick.y)
    && typeof brick.alive === "boolean";
}

function validSnapshot(data) {
  return data
    && data.version === SAVE_VERSION
    && PLAY_STATES.has(data.resumeState)
    && isFiniteNumber(data.lives)
    && isFiniteNumber(data.level)
    && isFiniteNumber(data.score)
    && isFiniteNumber(data.seed)
    && data.paddle
    && isFiniteNumber(data.paddle.x)
    && Array.isArray(data.balls)
    && data.balls.length > 0
    && data.balls.every(validBall)
    && Array.isArray(data.bricks)
    && data.bricks.length > 0
    && data.bricks.every(validBrick)
    && Array.isArray(data.powerUps)
    && Array.isArray(data.missiles)
    && data.effects
    && typeof data.effects === "object"
    && (data.rngState === null || isFiniteNumber(data.rngState));
}

export function snapshotGame(game) {
  const resumeState = game.state === STATES.PAUSED
    ? game.resumeState
    : game.state;
  if (!PLAY_STATES.has(resumeState)) {
    return null;
  }
  return {
    version: SAVE_VERSION,
    resumeState,
    lives: game.lives,
    level: game.level,
    score: game.score,
    seed: game.seed,
    paddle: clone(game.paddle),
    balls: clone(game.balls),
    pendingMulti: Boolean(game.pendingMulti),
    gateOpen: Boolean(game.gateOpen),
    barrier: game.barrier,
    bricks: clone(game.bricks),
    powerUps: clone(game.powerUps),
    missiles: clone(game.missiles),
    fireCooldown: game.fireCooldown,
    effects: clone(game.effects),
    rngState: rngStateOf(game.dropRng)
  };
}

export function applySnapshot(game, snapshot) {
  if (!validSnapshot(snapshot)) {
    return false;
  }
  game.lives = snapshot.lives;
  game.level = snapshot.level;
  game.score = snapshot.score;
  game.seed = snapshot.seed;
  game.paddle = clone(snapshot.paddle);
  game.balls = clone(snapshot.balls);
  game.ball = game.balls[0];
  game.pendingMulti = snapshot.pendingMulti;
  game.gateOpen = snapshot.gateOpen;
  game.barrier = snapshot.barrier;
  game.bricks = clone(snapshot.bricks);
  game.powerUps = clone(snapshot.powerUps);
  game.missiles = clone(snapshot.missiles);
  game.fireCooldown = snapshot.fireCooldown;
  game.effects = { ...game.effects, ...clone(snapshot.effects) };
  game.resumeState = snapshot.resumeState;
  game.state = STATES.PAUSED;
  game.saveNotice = false;
  game.nameEntry = "";
  game.accumulator = 0;
  if (isFiniteNumber(snapshot.rngState)) {
    game.dropRng = mulberry32(snapshot.rngState);
  }
  return true;
}

export function readSave(storage) {
  try {
    const raw = storage.getItem(SAVE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return validSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSave(storage, snapshot) {
  if (!validSnapshot(snapshot)) {
    return false;
  }
  storage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  return true;
}

export function hasSave(storage) {
  return readSave(storage) !== null;
}
