# Iteration 21 — fast ball

![Kinetile logo](assets/kinetile-logo.jpg)

A magenta hazard capsule raises the ball’s stored speed. The bat
still moves at its usual rate, so the rally gets harder rather than
simply faster everywhere.

## What this iteration adds

- The `FAST` power-up
- Ball speed scaled by 1.45 while the timer runs
- Restoration to the level’s normal speed when it expires

## How it works

`syncBallSpeeds` writes `ball.speed` from `speedForLevel` times a
scale factor. Moving balls are renormalised through `setBallVelocity`
so the current heading is kept. A new serve after a life is lost
picks up the remaining timer, so a Fast that outlasts a miss still
applies.

## Tests

New specs cover the raised speed and the restore when the timer ends.
