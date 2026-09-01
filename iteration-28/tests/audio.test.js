import { describe, expect, it } from "vitest";
import { CUES, createSilentAudio, powerCueName } from "../src/audio.js";
import { AVAILABLE_POWERUPS, FIXED_DT, POWERUP_TYPES, STATES } from "../src/constants.js";
import { createGame, launchBall, loseLife, startMatch, step } from "../src/game.js";
import { createInput } from "../src/input.js";
import { COLOURS, brickColour } from "../src/palette.js";

describe("audio and colour", () => {
  it("plays a serve cue when the ball is launched", () => {
    const audio = createSilentAudio();
    const game = createGame({ audio });
    startMatch(game);
    launchBall(game);
    expect(audio.events).toContain("serve");
  });

  it("plays brick and clear cues when the last brick is hit", () => {
    const audio = createSilentAudio();
    const game = createGame({ audio });
    startMatch(game);
    launchBall(game);
    audio.events.length = 0;
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
    expect(audio.events).toContain("brick");
    expect(audio.events).toContain("clear");
  });

  it("plays life and game-over cues", () => {
    const audio = createSilentAudio();
    const game = createGame({ audio });
    startMatch(game);
    loseLife(game);
    expect(audio.events).toContain("life");
    game.lives = 1;
    loseLife(game);
    expect(audio.events).toContain("over");
    expect(game.state).toBe(STATES.GAME_OVER);
  });

  it("tints bricks by row", () => {
    expect(brickColour({ row: 0 })).toBe(COLOURS.bricks[0]);
    expect(brickColour({ row: 8 })).toBe(COLOURS.bricks[0]);
    expect(COLOURS.bricks).toHaveLength(8);
  });

  it("gives every capsule type its own collect cue", () => {
    const names = AVAILABLE_POWERUPS.map((type) => powerCueName(type));
    const signatures = new Set(names.map((name) => JSON.stringify(CUES[name])));
    expect(names.every((name) => CUES[name])).toBe(true);
    expect(signatures.size).toBe(AVAILABLE_POWERUPS.length);
    expect(powerCueName(POWERUP_TYPES.MYSTERY)).toBe("powerMYSTERY");
  });

  it("does not require a browser audio context in tests", () => {
    const input = createInput();
    const audio = createSilentAudio();
    const game = createGame({ input, audio });
    input.press("Space");
    step(game, FIXED_DT);
    expect(game.audio).toBe(audio);
  });
});
