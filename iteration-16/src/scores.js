import {
  BRICK_ROWS,
  BRICK_SCORE,
  HIGH_SCORE_KEY,
  HIGH_SCORE_LIMIT,
  ROW_SCORE_BONUS
} from "./constants.js";

export function createMemoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem(key) {
      return Object.hasOwn(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    }
  };
}

export function scoreForBrick(brick) {
  return BRICK_SCORE + (BRICK_ROWS - 1 - brick.row) * ROW_SCORE_BONUS;
}

export function loadScores(storage) {
  try {
    const raw = storage.getItem(HIGH_SCORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry) => entry && typeof entry.name === "string" && Number.isFinite(entry.score))
      .map((entry) => ({ name: entry.name, score: entry.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, HIGH_SCORE_LIMIT);
  } catch {
    return [];
  }
}

export function saveScores(storage, scores) {
  storage.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
}

export function qualifies(scores, score) {
  if (score <= 0) {
    return false;
  }
  if (scores.length < HIGH_SCORE_LIMIT) {
    return true;
  }
  return score > scores[scores.length - 1].score;
}

export function insertScore(scores, entry) {
  return [...scores, entry]
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, HIGH_SCORE_LIMIT);
}
