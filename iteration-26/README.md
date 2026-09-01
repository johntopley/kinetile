# Iteration 26 — mystery

![Kinetile logo](assets/kinetile-logo.jpg)

A grey capsule is a lucky dip. Collecting it immediately applies
another power-up from the catalogue, never Mystery again.

## What this iteration adds

- The `MYSTERY` power-up
- A grey capsule that does not keep its own timer

## How it works

`applyPowerUp` intercepts `MYSTERY` and asks `dropRng` to pick from
`AVAILABLE_POWERUPS` with Mystery itself filtered out. The chosen type
is applied through the same function, so every existing effect path
stays in one place. A stub RNG that returns 0 therefore always
resolves to Wide, which keeps tests deterministic.

## Tests

A new spec injects a zero RNG and checks that Mystery becomes Wide.
