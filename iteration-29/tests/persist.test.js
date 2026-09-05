import { describe, expect, it } from "vitest";
import { FIXED_DT, POWERUP_DURATION, POWERUP_TYPES, SAVE_KEY, STATES } from "../src/constants.js";
import { createGame, launchBall, pauseGame, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { applyPowerUp } from "../src/powerups.js";
import { mulberry32 } from "../src/rng.js";
import {
  applySnapshot,
  hasSave,
  pauseCaptions,
  readSave,
  snapshotGame,
  titleCaptions,
  writeSave
} from "../src/save.js";
import { createMemoryStorage } from "../src/scores.js";

describe("pause and save", () => {
  it("pauses serve and play without advancing the world", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    launchBall(game);
    const x = game.ball.x;
    const y = game.ball.y;
    const slow = game.effects.slow;
    input.press("KeyP");
    step(game, 0.2);
    expect(game.state).toBe(STATES.PAUSED);
    expect(game.resumeState).toBe(STATES.PLAYING);
    expect(game.ball.x).toBe(x);
    expect(game.ball.y).toBe(y);
    expect(game.effects.slow).toBe(slow);

    input.release("KeyP");
    input.press("KeyP");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.PLAYING);
  });

  it("returns to the title from pause and leaves a save in place", () => {
    const storage = createMemoryStorage();
    const input = createInput();
    const game = createGame({ storage, input });
    startMatch(game);
    game.score = 180;
    input.press("Escape");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.PAUSED);
    input.release("Escape");
    input.press("KeyS");
    step(game, FIXED_DT);
    expect(game.saveNotice).toBe(true);
    expect(hasSave(storage)).toBe(true);
    input.release("KeyS");
    input.press("Escape");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.TITLE);
    expect(readSave(storage).score).toBe(180);
  });

  it("continues a saved game from the title screen", () => {
    const storage = createMemoryStorage();
    const input = createInput();
    const first = createGame({ storage, input, seed: 11 });
    startMatch(first);
    launchBall(first);
    first.score = 420;
    first.lives = 2;
    first.level = 2;
    first.ball.x = 310;
    first.ball.y = 240;
    applyPowerUp(first, POWERUP_TYPES.WIDE);
    first.effects.wide = 4;
    pauseGame(first);
    expect(snapshotGame(first)).not.toBeNull();
    writeSave(storage, snapshotGame(first));

    const input2 = createInput();
    const second = createGame({ storage, input: input2, seed: 99 });
    expect(second.hasSave).toBe(true);
    expect(titleCaptions(true)).toContain("C to continue a saved game");
    input2.press("KeyC");
    step(second, FIXED_DT);
    expect(second.state).toBe(STATES.PAUSED);
    expect(second.resumeState).toBe(STATES.PLAYING);
    expect(second.score).toBe(420);
    expect(second.lives).toBe(2);
    expect(second.level).toBe(2);
    expect(second.ball.x).toBe(310);
    expect(second.ball.y).toBe(240);
    expect(second.effects.wide).toBe(4);
    expect(second.paddle.width).toBe(first.paddle.width);
  });

  it("keeps drop-rng continuity across a save", () => {
    const rng = mulberry32(20260901);
    rng();
    rng();
    const state = rng.getState();
    const expected = rng();
    const restored = mulberry32(state);
    expect(restored()).toBe(expected);
  });

  it("restores the same next drop after a save", () => {
    const storage = createMemoryStorage();
    const game = createGame({ storage, seed: 5 });
    startMatch(game);
    const before = game.dropRng.getState();
    const preview = mulberry32(before);
    const first = preview();
    const second = preview();
    pauseGame(game);
    writeSave(storage, snapshotGame(game));

    const loaded = createGame({ storage, seed: 0 });
    applySnapshot(loaded, readSave(storage));
    expect(loaded.dropRng()).toBe(first);
    expect(loaded.dropRng()).toBe(second);
  });

  it("ignores a corrupt or version-mismatched save", () => {
    const storage = createMemoryStorage();
    storage.setItem(SAVE_KEY, "{not json");
    expect(readSave(storage)).toBeNull();
    const input = createInput();
    const game = createGame({ storage, input });
    expect(game.hasSave).toBe(false);
    input.press("KeyC");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.TITLE);
    storage.setItem(SAVE_KEY, JSON.stringify({ version: 99, resumeState: STATES.SERVE }));
    expect(readSave(storage)).toBeNull();
  });

  it("does not pause from the title or from game over", () => {
    const input = createInput();
    const game = createGame({ input });
    input.press("KeyP");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.TITLE);
    startMatch(game);
    game.state = STATES.GAME_OVER;
    input.release("KeyP");
    input.press("KeyP");
    step(game, FIXED_DT);
    expect(game.state).toBe(STATES.GAME_OVER);
  });

  it("lists the new keys on the title and pause cards", () => {
    expect(titleCaptions(false)).not.toContain("C to continue a saved game");
    expect(titleCaptions(false).join(" ")).toMatch(/P pauses/);
    expect(titleCaptions(true).join(" ")).toMatch(/C to continue/);
    expect(pauseCaptions(false)).toContain("S to save");
    expect(pauseCaptions(true)[0]).toBe("Game saved");
  });

  it("leaves effect timers frozen while paused", () => {
    const input = createInput();
    const game = createGame({ input });
    startMatch(game);
    applyPowerUp(game, POWERUP_TYPES.SLOW);
    expect(game.effects.slow).toBe(POWERUP_DURATION);
    pauseGame(game);
    step(game, 1);
    expect(game.effects.slow).toBe(POWERUP_DURATION);
  });
});
