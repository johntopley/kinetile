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
export const BRICK_SCORE = 50;
export const ROW_SCORE_BONUS = 10;
export const HIGH_SCORE_LIMIT = 10;
export const HIGH_SCORE_KEY = "kinetile-high-scores";
export const NAME_LENGTH = 3;

export const POWERUP_DURATION = 10;
export const POWERUP_FALL_SPEED = 140;
export const POWERUP_DROP_CHANCE = 0.2;
export const POWERUP_WIDTH = 36;
export const POWERUP_HEIGHT = 16;
export const WIDE_PADDLE_WIDTH = 168;
export const LASER_COOLDOWN = 0.28;
export const LASER_SPEED = 560;
export const LASER_WIDTH = 4;
export const LASER_HEIGHT = 16;

export const MAX_BALLS = 5;

export const POWERUP_TYPES = Object.freeze({
  WIDE: "WIDE",
  LASER: "LASER",
  PIERCE: "PIERCE",
  MULTI: "MULTI"
});
export const AVAILABLE_POWERUPS = Object.freeze([
  POWERUP_TYPES.WIDE,
  POWERUP_TYPES.LASER,
  POWERUP_TYPES.PIERCE,
  POWERUP_TYPES.MULTI
]);

export const STATES = Object.freeze({
  TITLE: "TITLE",
  SERVE: "SERVE",
  PLAYING: "PLAYING",
  LIFE_LOST: "LIFE_LOST",
  LEVEL_CLEAR: "LEVEL_CLEAR",
  GAME_OVER: "GAME_OVER",
  HIGH_SCORE_ENTRY: "HIGH_SCORE_ENTRY"
});

export const ITERATION = 11;
export const MONOCHROME = false;
