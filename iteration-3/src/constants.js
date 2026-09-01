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
export const MIN_VERTICAL_RATIO = 0.35;
export const PADDLE_MAX_ANGLE = (Math.PI * 5) / 12;

export const INITIAL_LIVES = 3;

export const STATES = Object.freeze({
  TITLE: "TITLE",
  SERVE: "SERVE",
  PLAYING: "PLAYING",
  LIFE_LOST: "LIFE_LOST",
  GAME_OVER: "GAME_OVER"
});

export const ITERATION = 3;
export const MONOCHROME = true;
