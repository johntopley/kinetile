# Iteration 13 — armoured bricks

![Kinetile logo](assets/kinetile-logo.jpg)

Not every tile dies on the first tap. A regular subset of the grid
is armoured: two or three hits, drawn with a rim and remaining-hit
pips. The brick fades as it weakens.

## What this iteration adds

- Multi-hit bricks mixed into seeded layouts
- Visual damage states (opacity, rim, hit pips)
- Points and power-up drops only when the brick is finally removed

## How it works

`hitBrick` already decremented a hit counter. This snapshot gives
some cells a `maxHits` of 2 or 3 when the wall is built.

The pattern is positional: cells where `(col + row) % 5 === 2` are
candidates, and the RNG then chooses two or three hits. That keeps
armour in readable bands instead of sprinkling it at random, and it
leaves `bricks[0]` as a one-hit tile so earlier tests stay stable.

A first hit still bounces the ball. Pierce still spends one hit per
tick, so an armoured brick in a piercing column takes several ticks
to fall.

## Tests

New specs cover a two-hit brick surviving the first blow, dying on
the second, and awarding score only on removal. Layout determinism
tests still pass.
