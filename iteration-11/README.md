# Iteration 11 — multi-ball

![Kinetile logo](assets/kinetile-logo.jpg)

A green capsule splits the rally. Two extra balls appear from the
current one, fanned left and right. Unlike the other power-ups, the
extras are not time-limited: they stay until they fall off the
bottom.

## What this iteration adds

- The `MULTI` power-up
- A `game.balls` list, with `game.ball` kept as the first live ball
  so earlier tests still read the same field
- A life is lost only when every ball is gone
- A cap of five balls so a pile-up of capsules cannot flood the
  playfield

## Why extras are not timed

A timed extra ball would vanish mid-rally. That feels like the game
took a life away. Classic Arkanoid keeps the extras until they are
missed, so this snapshot follows that rule and documents the
exception.

If the capsule is caught during serve, the split is queued
(`pendingMulti`) and happens on launch.

## Tests

New specs cover spawning two extras, ignoring the timer, losing a
life only after the last ball falls, and the five-ball cap.
