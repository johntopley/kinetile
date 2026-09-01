# Iteration 17 — extra life

![Kinetile logo](assets/kinetile-logo.jpg)

A gold `PLAYER` capsule grants another life, matching Arkanoid’s P.
The stock is capped at six so a lucky streak cannot pile lives
without end.

## What this iteration adds

- The `PLAYER` power-up
- An immediate extra life, not a timed effect
- A cap of six lives

## How it works

`applyPowerUp` increments `game.lives` and clamps it. There is no
timer to tick. The HUD already draws one pip per life, so a fourth
or fifth pip simply appears.

## Tests

New specs cover the extra life, the six-life cap, and that a
`PLAYER` capsule does not start a timed effect.
