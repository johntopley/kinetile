import {
  BRICK_COLUMNS,
  BRICK_GAP,
  BRICK_HEIGHT,
  BRICK_OFFSET_X,
  BRICK_OFFSET_Y,
  BRICK_ROWS,
  BRICK_WIDTH,
  SHIFT_TWEEN
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
    shifting: false,
    shifted: false,
    shiftTween: 0,
    shiftFromX: 0,
    shiftFromY: 0,
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

export function adjacentVacancies(brick, bricks) {
  const occupied = occupyGrid(bricks);
  occupied.delete(`${brick.col},${brick.row}`);
  const spots = [];
  const deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [dc, dr] of deltas) {
    const col = brick.col + dc;
    const row = brick.row + dr;
    if (col < 0 || col >= BRICK_COLUMNS || row < 0 || row >= BRICK_ROWS) {
      continue;
    }
    if (!occupied.has(`${col},${row}`)) {
      spots.push({ col, row });
    }
  }
  return spots;
}

export function shiftBrick(brick, dest) {
  brick.shiftFromX = brick.x;
  brick.shiftFromY = brick.y;
  brick.col = dest.col;
  brick.row = dest.row;
  brick.x = BRICK_OFFSET_X + dest.col * BRICK_WIDTH;
  brick.y = BRICK_OFFSET_Y + dest.row * BRICK_HEIGHT;
  brick.shifted = true;
  brick.shiftTween = SHIFT_TWEEN;
}

export function tryShiftBrick(brick, bricks, rng) {
  if (!brick.shifting || brick.shifted) {
    return false;
  }
  const spots = adjacentVacancies(brick, bricks);
  if (spots.length > 0) {
    const dest = spots[Math.floor(rng() * spots.length)] ?? spots[0];
    shiftBrick(brick, dest);
  } else {
    brick.shifted = true;
  }
  return true;
}

export function tickBrickTweens(bricks, dt) {
  for (const brick of bricks) {
    if (brick.shiftTween > 0) {
      brick.shiftTween = Math.max(0, brick.shiftTween - dt);
    }
  }
}

export function brickDrawOrigin(brick) {
  if (brick.shiftTween <= 0) {
    return { x: brick.x, y: brick.y };
  }
  const t = brick.shiftTween / SHIFT_TWEEN;
  return {
    x: brick.x + (brick.shiftFromX - brick.x) * t,
    y: brick.y + (brick.shiftFromY - brick.y) * t
  };
}
