import {
  BRICK_COLUMNS,
  BRICK_GAP,
  BRICK_HEIGHT,
  BRICK_OFFSET_X,
  BRICK_OFFSET_Y,
  BRICK_ROWS,
  BRICK_WIDTH
} from "./constants.js";

export function createBrick(col, row, extras = {}) {
  return {
    col,
    row,
    x: BRICK_OFFSET_X + col * BRICK_WIDTH,
    y: BRICK_OFFSET_Y + row * BRICK_HEIGHT,
    width: BRICK_WIDTH - BRICK_GAP,
    height: BRICK_HEIGHT - BRICK_GAP,
    alive: true,
    hits: 1,
    maxHits: 1,
    ...extras
  };
}

export function createFixedWall() {
  const bricks = [];
  for (let row = 0; row < BRICK_ROWS; row += 1) {
    for (let col = 0; col < BRICK_COLUMNS; col += 1) {
      bricks.push(createBrick(col, row));
    }
  }
  return bricks;
}

export function brickBounds(brick) {
  return {
    left: brick.x,
    right: brick.x + brick.width,
    top: brick.y,
    bottom: brick.y + brick.height
  };
}

export function remainingBricks(bricks) {
  return bricks.filter((brick) => brick.alive);
}

export function occupyGrid(bricks) {
  const occupied = new Set();
  for (const brick of bricks) {
    if (brick.alive) {
      occupied.add(`${brick.col},${brick.row}`);
    }
  }
  return occupied;
}
