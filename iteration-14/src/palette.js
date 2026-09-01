export const COLOURS = Object.freeze({
  background: "#05070c",
  ink: "#e8f4ff",
  muted: "#8aa0b5",
  wall: "#3d5a80",
  paddle: "#5ad6ff",
  ball: "#f4fbff",
  hud: "#9ad8ff",
  overlay: "rgba(5, 7, 12, 0.62)",
  powerUps: Object.freeze({
    WIDE: "#5ad6ff",
    LASER: "#ff4d8d",
    PIERCE: "#ffd166",
    MULTI: "#7cffb2",
    SLOW: "#c084fc"
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

export function brickColour(brick) {
  return COLOURS.bricks[brick.row % COLOURS.bricks.length];
}
