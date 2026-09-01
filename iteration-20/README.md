# Iteration 20 — reduce

![Kinetile logo](assets/kinetile-logo.jpg)

An orange hazard capsule shrinks the bat. Wide still wins if you
catch it afterwards: the two effects cancel rather than stacking.

## What this iteration adds

- The `REDUCE` power-up
- A 56-pixel bat while the timer runs
- Mutual exclusion with Wide

## How it works

`syncPaddleWidth` is the single place that chooses between Wide,
Reduce, and the default width. Collecting Reduce clears the Wide
timer, and collecting Wide clears Reduce. When either timer expires,
the helper runs again so the remaining effect (if any) is applied.

## Tests

New specs cover the shrink, the restore, and Wide overriding Reduce.
