# Iteration 28 — finished game

![Kinetile logo](assets/kinetile-logo.jpg)

This snapshot presents Kinetile as a finished local game. The canvas
no longer names the iteration or advertises a single new mechanic.
The old table-wide Slow is gone; the remaining Slow capsule affects
the ball only.

## What this iteration adds

- A standalone title, HUD, and page chrome
- Ball-only Slow in place of the global half-speed effect
- A logo intro on the title screen: fade, rise, idle float, and a
  breathing glow

## How it works

`title.js` is DOM-free pose maths. The renderer keeps a clock that
resets whenever the title state is entered, then draws the logo with
a breathing glow. Captions fade in after the mark has settled.

`POWERUP_TYPES.SLOW` now writes `ball.speed` through `syncBallSpeeds`.
Bat travel, falling capsules, and the rest of the table stay at full
pace. Fast still stacks with it.

## Tests

New specs cover the title poses. The Slow specs now assert a halved
ball with an unslowed bat.
