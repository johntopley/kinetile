import { describe, expect, it } from "vitest";
import {
  BRICK_SCORE,
  HIGH_SCORE_KEY,
  HIGH_SCORE_LIMIT,
  NAME_LENGTH,
  ROW_SCORE_BONUS,
  STATES
} from "../src/constants.js";
import { createGame, finishMatch, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import {
  createMemoryStorage,
  insertScore,
  loadScores,
  qualifies,
  scoreForBrick
} from "../src/scores.js";

describe("scores", () => {
  it("pays more for higher bricks", () => {
    expect(scoreForBrick({ row: 7 })).toBe(BRICK_SCORE);
    expect(scoreForBrick({ row: 0 })).toBe(BRICK_SCORE + 7 * ROW_SCORE_BONUS);
  });

  it("adds points when a brick is destroyed", () => {
    const game = createGame({ seed: 1 });
    startMatch(game);
    game.state = STATES.PLAYING;
    for (const brick of game.bricks) {
      brick.alive = false;
    }
    const last = game.bricks[0];
    last.alive = true;
    game.ball.x = last.x + last.width / 2;
    game.ball.y = last.y + last.height + game.ball.radius - 1;
    game.ball.vx = 0;
    game.ball.vy = -200;
    step(game, 0);
    expect(game.score).toBe(scoreForBrick(last));
  });

  it("keeps ten scores and rejects a weaker one", () => {
    const filled = Array.from({ length: HIGH_SCORE_LIMIT }, (_, index) => ({
      name: "AAA",
      score: 1000 - index
    }));
    expect(qualifies(filled, 990)).toBe(false);
    expect(qualifies(filled, 1001)).toBe(true);
    const next = insertScore(filled, { name: "BOB", score: 1001 });
    expect(next[0]).toEqual({ name: "BOB", score: 1001 });
    expect(next).toHaveLength(HIGH_SCORE_LIMIT);
  });

  it("opens name entry for a qualifying score and persists it", () => {
    const storage = createMemoryStorage();
    const input = createInput();
    const game = createGame({ storage, input });
    startMatch(game);
    game.score = 250;
    finishMatch(game);
    expect(game.state).toBe(STATES.HIGH_SCORE_ENTRY);

    input.press("KeyJ");
    step(game, 0);
    input.press("KeyO");
    step(game, 0);
    input.press("KeyE");
    step(game, 0);
    expect(game.nameEntry).toBe("JOE");
    input.press("Enter");
    step(game, 0);
    expect(game.state).toBe(STATES.GAME_OVER);
    expect(game.scores[0]).toEqual({ name: "JOE", score: 250 });
    expect(JSON.parse(storage.getItem(HIGH_SCORE_KEY))[0].name).toBe("JOE");
    expect(game.scores[0].name).toHaveLength(NAME_LENGTH);
  });

  it("skips name entry when the score is zero", () => {
    const game = createGame();
    startMatch(game);
    finishMatch(game);
    expect(game.state).toBe(STATES.GAME_OVER);
    expect(loadScores(game.storage)).toEqual([]);
  });
});
