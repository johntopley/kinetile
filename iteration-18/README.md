# Iteration 18 — the gate

![Kinetile logo](assets/kinetile-logo.jpg)

A white `BREAK` capsule opens a hole in the right wall, matching
Arkanoid’s Break. Steer the bat through it to skip the rest of the
level.

## What this iteration adds

- The `BREAK` power-up
- A visible gate in the right wall
- A relaxed right-hand clamp so the bat can leave
- Level clear when the bat exits

## How it works

`game.gateOpen` is a flag, not a timer. The right wall is drawn in two
segments with a lit lip on the gap. While the gate is open the paddle
playfield extends almost to the canvas edge. Crossing that edge calls
`clearLevel`.

The gate closes on a new match or a new level so it cannot leak into
the next formation.

## Tests

New specs cover opening the gate, clearing the level on exit, and
closing the gate on the following level.
