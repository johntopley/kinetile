# Iteration 23 — fireball

![Kinetile logo](assets/kinetile-logo.jpg)

An orange capsule sets the ball alight. It passes through bricks the
way Pierce does, and each hit also chips the four orthogonal
neighbours.

## What this iteration adds

- The `FIREBALL` power-up
- Piercing travel while the timer runs
- One extra hit on each adjacent brick (left, right, above, below)

## How it works

Collision uses the existing pierce path so the ball does not bounce.
After the struck brick is resolved, `orthogonalNeighbours` finds live
tiles that share an edge. Those neighbours are damaged through the
same `destroyBrick` path with splash turned off, so the fire does not
chain across the whole wall.

Lasers are unchanged: they still hit a single brick.

## Tests

New specs cover the neighbour chip and the lack of bounce while
Fireball is active.
