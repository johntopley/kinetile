# Iteration 25 — magnet bat

![Kinetile logo](assets/kinetile-logo.jpg)

A violet capsule pulls a descending ball toward the nearest bat once
it is in the lower half of the court. The stored speed is unchanged;
only the heading bends.

## What this iteration adds

- The `MAGNET` power-up
- Horizontal attraction in the lower playfield
- A violet tint on the bat while it is active

## How it works

After wall collision, `attractBallToPaddle` adds a signed pull to
`vx` and renormalises through `setBallVelocity`. The pull only applies
below `MAGNET_MIN_Y` and within `MAGNET_RANGE`, so the ball is not
yanked sideways through the brick wall. With Twin active, the nearer
bat is the attractor.

## Tests

A new spec places a ball to the left of the bat and checks that its
x moves toward the centre while Magnet is on.
