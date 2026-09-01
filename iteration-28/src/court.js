export const COURT_PATTERN_COUNT = 8;

export function courtPattern(level) {
  return (Math.max(1, level) - 1) % COURT_PATTERN_COUNT;
}
