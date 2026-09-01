export const COLOURS = Object.freeze({
  background: "#05070c",
  court: "#081018",
  ink: "#e8f4ff",
  muted: "#8aa0b5",
  wall: "#3d5a80",
  wallHighlight: "#6f93b8",
  wallShadow: "#1b2d42",
  paddle: "#5ad6ff",
  paddleMetal: "#d7f6ff",
  ball: "#f4fbff",
  hud: "#9ad8ff",
  overlay: "rgba(5, 7, 12, 0.62)",
  powerUps: Object.freeze({
    WIDE: "#5ad6ff",
    LASER: "#ff4d8d",
    PIERCE: "#ffd166",
    MULTI: "#7cffb2",
    SLOW: "#c084fc",
    CATCH: "#9ad8ff",
    PLAYER: "#ffe066",
    BREAK: "#ffffff",
    BARRIER: "#7cffb2",
    REDUCE: "#ff7a59",
    FAST: "#ff6ad5",
    REVERSE: "#ff4d8d",
    FIREBALL: "#ff7a59",
    TWIN: "#7aa2ff",
    MAGNET: "#c084fc",
    MYSTERY: "#9aa6b2"
  }),
  bricks: Object.freeze([
    "#ff4d8d",
    "#ff7a59",
    "#ffd166",
    "#7cffb2",
    "#5ad6ff",
    "#7aa2ff",
    "#c084fc",
    "#ff6ad5"
  ])
});

export function parseHex(hex) {
  const raw = hex.replace("#", "");
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16)
  };
}

export function toHex(rgb) {
  const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
  return `#${[rgb.r, rgb.g, rgb.b].map((value) => clamp(value).toString(16).padStart(2, "0")).join("")}`;
}

export function mixHex(hex, other, amount) {
  const a = parseHex(hex);
  const b = parseHex(other);
  const t = Math.max(0, Math.min(1, amount));
  return toHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  });
}

export function lighten(hex, amount) {
  return mixHex(hex, "#ffffff", amount);
}

export function darken(hex, amount) {
  return mixHex(hex, "#000000", amount);
}

export function brickColour(brick) {
  return COLOURS.bricks[brick.row % COLOURS.bricks.length];
}

export function brickFaceColour(brick) {
  const base = brick.shifting && !brick.shifted ? COLOURS.powerUps.SLOW : brickColour(brick);
  const strength = brick.maxHits > 0 ? brick.hits / brick.maxHits : 1;
  return mixHex(darken(base, 0.35), base, strength);
}
