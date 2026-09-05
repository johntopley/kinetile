export function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(t) {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

export function titleLogoPose(time) {
  const seconds = Math.max(0, time);
  const intro = easeOutCubic(seconds / 1.15);
  const bob = Math.sin(seconds * 1.15) * 7 * intro;
  const breath = 0.5 + 0.5 * Math.sin(seconds * 1.65);
  return {
    y: 72 - (1 - intro) * 40 + bob,
    scale: 0.84 + 0.16 * intro + 0.02 * breath * intro,
    opacity: intro,
    glow: (12 + 20 * breath) * intro
  };
}

export function titleCaptionOpacity(time) {
  return easeOutCubic((time - 0.55) / 0.65);
}
