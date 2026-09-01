# Iteration 22 — reverse controls

![Kinetile logo](assets/kinetile-logo.jpg)

A pink hazard capsule swaps left and right. The rest of the table is
unchanged; only the steering is inverted for ten seconds.

## What this iteration adds

- The `REVERSE` power-up
- Inverted A/D and arrow keys while the timer runs

## How it works

`updatePaddle` takes an `invert` flag. While `effects.reverse` is
positive, a right-hand key produces a left-hand velocity and vice
versa. Opposing keys still cancel, because the sign flip happens
after both directions are summed.

## Tests

New specs cover right-key travel to the left, and restoration when
the timer expires.
