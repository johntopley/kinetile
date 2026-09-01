# Iteration 19 — barrier

![Kinetile logo](assets/kinetile-logo.jpg)

A mint capsule lays a glowing line across the pit. The first ball
that would fall bounces off it instead, then the line vanishes.

## What this iteration adds

- The `BARRIER` power-up
- A one-charge floor just above the bottom
- A visual bar while the charge remains

## How it works

`game.barrier` is a charge count, not a timer. Collecting the capsule
sets it to 1. A later collect while it is still armed does not stack.
When a descending ball crosses `BARRIER_Y`, its vertical velocity is
flipped and the charge is spent.

A new match clears the charge through `resetEffects`.

## Tests

New specs cover the bounce, the spent charge, and a second miss that
then costs a life.
