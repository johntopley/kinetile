# Iteration 15 — ornament

![Kinetile logo](assets/kinetile-logo.jpg)

The rules are unchanged. This snapshot spends the budget on the
picture: bevelled bricks, a dressed bat, and a ball that reads as a
sphere rather than a disc.

## What this iteration adds

- Top-left highlights and bottom-right shade on every brick
- A damage fade plus hairline cracks on armoured tiles
- A capsule-shaped bat with a metal sheen, end caps, and a centre gem
- Laser ports on the bat while that effect is active
- A radial highlight on the ball
- Bevelled walls and a slightly deeper court colour

## How it works

Colour maths lives in `palette.js`. `lighten` and `darken` mix a hex
towards white or black so the renderer can build a bevel from a single
face colour. Armoured bricks use `brickFaceColour`, which also mixes
in damage so a two-hit tile looks worn before it vanishes.

None of this touches `step`. The physics, scores, and power-ups are
the iteration-14 set.

## Tests

A new palette spec checks that mixing, lightening, and the damaged
face colour stay deterministic. Carried-forward gameplay tests still
pass.
