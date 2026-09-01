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
- A distinct collect jingle for every capsule type
- A faint geometric court texture that changes with the level
- Fewer armoured bricks, and a one-row gap above the wall

## How it works

`title.js` is DOM-free pose maths. The renderer keeps a clock that
resets whenever the title state is entered, then draws the logo with
a breathing glow. Captions fade in after the mark has settled.

`POWERUP_TYPES.SLOW` now writes `ball.speed` through `syncBallSpeeds`.
Bat travel, falling capsules, and the rest of the table stay at full
pace. Fast still stacks with it.

Magnet pull, wall hits, and brick hits share the bat’s minimum
vertical component so a shallow rally cannot lock into a horizontal
ping-pong.

Collecting a capsule plays `power` plus the type name, so Wide and
Fireball do not share a sting. Mystery keeps its own cue even though
the effect then resolves to another type.

The court fill is still a near-black wash. `courtPattern` picks one
of eight line or dot lattices from the level number; the renderer
clips them to the playfield at very low contrast.

The brick wall sits one row lower than the top rail so a well-aimed
ball can run along the ceiling. Armoured tiles are sparse: only a
thin diagonal of cells is even eligible, and most of those stay at
one hit.

## Tests

New specs cover the title poses, the per-type collect cues, and the
court pattern cycle. The Slow specs assert a halved ball with an
unslowed bat.
