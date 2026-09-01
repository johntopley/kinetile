export const WIDTH = 960;
export const HEIGHT = 720;
export const FIXED_DT = 1 / 120;
export const MAX_FRAME_DT = 0.25;

export const WALL_THICKNESS = 16;
export const HUD_HEIGHT = 80;

export const PLAYFIELD_LEFT = WALL_THICKNESS;
export const PLAYFIELD_RIGHT = WIDTH - WALL_THICKNESS;
export const PLAYFIELD_TOP = HUD_HEIGHT + WALL_THICKNESS;
export const PLAYFIELD_BOTTOM = HEIGHT - 8;

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 16;
export const PADDLE_SPEED = 520;
export const PADDLE_Y = HEIGHT - 48;

export const BALL_RADIUS = 7;
export const BALL_SPEED = 360;
export const LEVEL_SPEED_STEP = 28;
export const MAX_BALL_SPEED = 520;
export const MIN_VERTICAL_RATIO = 0.35;
export const PADDLE_MAX_ANGLE = (Math.PI * 5) / 12;
export const DEFAULT_SEED = 20260901;

export const BRICK_COLUMNS = 14;
export const BRICK_ROWS = 8;
export const BRICK_WIDTH = 64;
export const BRICK_HEIGHT = 24;
export const BRICK_GAP = 2;
export const BRICK_OFFSET_X = PLAYFIELD_LEFT + 16;
export const BRICK_OFFSET_Y = PLAYFIELD_TOP + 16;

export const INITIAL_LIVES = 3;

export const STATES = Object.freeze({
  TITLE: "TITLE",
  SERVE: "SERVE",
  PLAYING: "PLAYING",
  LIFE_LOST: "LIFE_LOST",
  LEVEL_CLEAR: "LEVEL_CLEAR",
  GAME_OVER: "GAME_OVER"
});

export const ITERATION = 6;
export const MONOCHROME = false;
