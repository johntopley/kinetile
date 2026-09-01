# Iteration 12 — half-speed

![Kinetile logo](assets/kinetile-logo.jpg)

A violet capsule halves the pace of the rally. Bat, balls, missiles,
and falling capsules all move at half speed for ten seconds of real
time. The effect timer itself is not slowed, so the window stays
honest.

## What this iteration adds

- The `SLOW` power-up
- A motion scale of 0.5 applied inside `step`, not by changing the
  fixed timestep
- The timer still counts in real `dt` so ten seconds means ten
  seconds

## How it works

`motionScale(game)` returns 0.5 while `effects.slow` is active.
Serve and play then integrate positions with `dt * scale`. The
simulation still ticks at 120 Hz; only the displacement per tick
shrinks. That keeps collision resolution stable and lets tests expire
the effect with a plain `step(game, 10)`.

Halving `FIXED_DT` itself would have changed how many times effects
and input were sampled. Scaling motion keeps those clocks aligned
with wall time.

## Tests

New specs cover halved bat travel, an unslowed control comparison,
and timer expiry restoring full speed.
