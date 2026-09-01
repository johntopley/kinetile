# Iteration 10 — piercing ball

![Kinetile logo](assets/kinetile-logo.jpg)

A gold capsule charges the ball. For ten seconds it slices through
bricks instead of bouncing off them, so a well-aimed shot can carve a
column in a single pass.

## What this iteration adds

- The `PIERCE` power-up
- Brick hits that destroy without reflecting the ball
- A gold glow on the ball while the effect is active

## How it works

`collideBallWithBricks` already accepted a `pierce` flag. This
iteration turns that flag on while `effects.pierce` is counting down.
The ball still reports the first overlapping brick in a tick; the
brick is destroyed, but `resolveCircleAabb` is skipped so velocity is
unchanged.

At 120 Hz the ball travels only a few pixels per tick, so a piercing
shot still meets bricks one cell at a time. That is enough to cut a
column without tunnelling past a row.

Walls and the bat still bounce normally. Pierce is a brick rule, not
a licence to leave the arena.

## Tests

New specs show a piercing hit that keeps `vy` pointing the same way,
and a normal hit that still reflects once the timer expires.
