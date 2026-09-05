import {
  BALL_SPEED,
  BRICK_COLUMNS,
  BRICK_ROWS,
  LEVEL_SPEED_STEP,
  MAX_BALL_SPEED
} from "./constants.js";
import { createBrick } from "./bricks.js";
import { mulberry32, seedForLevel } from "./rng.js";

function shouldPlace(pattern, row, col, rng) {
  if (pattern === 0) {
    return rng() > 0.2;
  }
  if (pattern === 1) {
    return (row + col) % 2 === 0;
  }
  if (pattern === 2) {
    return col >= row && col < BRICK_COLUMNS - row;
  }
  return row % 2 === 0 || rng() > 0.45;
}

export function hitsForCell(col, row, rng) {
  if ((col + row) % 8 !== 3 || rng() < 0.72) {
    return 1;
  }
  return rng() > 0.9 ? 3 : 2;
}

export function createLevelWall(rng) {
  const pattern = Math.floor(rng() * 4);
  const bricks = [];

  for (let row = 0; row < BRICK_ROWS; row += 1) {
    for (let col = 0; col < BRICK_COLUMNS; col += 1) {
      if (shouldPlace(pattern, row, col, rng) && rng() > 0.08) {
        const hits = hitsForCell(col, row, rng);
        const shifting = (col + row) % 7 === 3 && rng() > 0.3;
        bricks.push(createBrick(col, row, { hits, maxHits: hits, shifting }));
      }
    }
  }

  if (bricks.length === 0) {
    bricks.push(createBrick(Math.floor(BRICK_COLUMNS / 2), 0));
  }

  return bricks;
}

export function wallForLevel(baseSeed, level) {
  const rng = mulberry32(seedForLevel(baseSeed, level));
  return createLevelWall(rng);
}

export function speedForLevel(level) {
  return Math.min(MAX_BALL_SPEED, BALL_SPEED + (level - 1) * LEVEL_SPEED_STEP);
}
