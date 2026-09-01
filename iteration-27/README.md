# Iteration 27 — ball-only Slow

![Kinetile logo](assets/kinetile-logo.jpg)

A pale capsule slows the ball without touching the bat or falling
capsules. The older purple Slow still halves the whole table; this
one is the more generous sibling.

## What this iteration adds

- The `BALLSLOW` power-up
- Ball speed halved while the timer runs
- Full-speed bat travel throughout

## How it works

`ballSpeedScale` now multiplies Fast and Ball-slow together, and
`syncBallSpeeds` writes the result onto every live ball. Effect
timers still tick in real time, matching Slow, so a half-speed ball
does not stretch the duration. The bat and capsules use the usual
motion step, not the ball’s stored speed.

## Tests

New specs cover the halved ball speed, full-speed bat travel, and
restoration when the timer expires.
