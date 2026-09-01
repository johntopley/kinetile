# Iteration 24 — twin bat

![Kinetile logo](assets/kinetile-logo.jpg)

A blue capsule mirrors the bat across the playfield. The twin shares
the same width and height, and it can bounce the ball, catch
capsules, and fire lasers.

## What this iteration adds

- The `TWIN` power-up
- A mirrored bat at `WIDTH - paddle.x`
- Shared collision for balls, capsules, and lasers

## How it works

`mirroredPaddle` copies the live bat and flips its x. Each tick the
simulation treats that copy as a second collider. Catch records
`ball.catchTwin` so a stuck ball rides the mirror rather than jumping
to the original. When Twin expires, stuck balls on the mirror are
released.

## Tests

New specs cover a bounce on the twin and collecting a capsule with it.
