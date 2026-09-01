# Kinetile — agent guidance

Kinetile is a Breakout/Arkanoid-style game that lives entirely in the
browser. The repository is organised as a sequence of complete, playable
snapshots. Each `iteration-N/` folder is a self-contained game at that
point in the design, with its own README, assets, source, and tests.

## Commit messages

- Use imperative mood in the subject line (e.g. “Fix …”, “Add …”,
  “Update …”)
- Leave a blank line between the subject and the body
- Wrap the body at 72 characters per line
- Focus the subject on what changed; use the body to explain why and
  any important behaviour or trade-offs
- Prefer short paragraphs over bullet lists unless listing distinct
  items aids clarity

## Game design

Kinetile is a local keyboard game. There is no network play, no
accounts, and no server. The playfield is a 960×720 logical canvas
scaled to the viewport.

Iterations 1–5 are monochrome (white on black). Colour and synthesised
sound arrive in iteration 6. Scoring and a persisted high-score table
arrive in iteration 7. Iterations 8–12 add Arkanoid-style power-ups.
Iterations 13–14 add tougher brick types. Iteration 15 ornaments the
playfield. Iterations 16–27 add Catch, extra lives, a Break gate,
Barrier, Reduce, Fast, Reverse, Fireball, Twin bat, Magnet, Mystery,
and a ball-only Slow.

The title screen shows the Kinetile logo in every iteration. Iterations
1–5 draw that logo in grayscale so the monochrome constraint still
holds.

Power-up capsules drop from randomly chosen bricks and most effects
are time-limited. Multi-ball is the exception: extra balls persist
until they are lost, matching classic Arkanoid and avoiding a mid-rally
disappearance.

## Architecture

Each iteration is zero-build vanilla JavaScript ES modules plus an
HTML5 Canvas 2D renderer. There is no bundler and no per-iteration
`package.json`. Serve the repository root (or an iteration folder) as
static files.

Simulation uses a fixed timestep of 1/120 s driven by
`requestAnimationFrame`, with frame time clamped to 0.25 s. That keeps
physics frame-rate independent, reduces tunnelling, and lets tests step
the world without a real clock.

Randomness (level layouts, power-up drops) goes through a seeded
`mulberry32` generator so tests can reproduce a given run.

### Module boundaries

Game logic modules must stay DOM-free so Node/Vitest can import them
directly. Anything that touches `window`, `document`, `canvas`, or the
Web Audio API lives in `render.js`, `main.js`, or a thin adapter
injected from `main.js`.

Typical layout inside an iteration:

- `src/constants.js` — logical resolution, speeds, sizes
- `src/input.js` — keyboard state
- `src/paddle.js`, `src/ball.js`, `src/bricks.js` — entities
- `src/physics.js` — pure collision maths
- `src/rng.js` — seeded PRNG
- `src/levels.js` — layout generation
- `src/game.js` — state machine and `step(dt)`
- `src/render.js` — drawing only
- `src/main.js` — canvas, input wiring, rAF loop
- `src/audio.js` — Web Audio synthesis (from iteration 6)
- `src/scores.js` — high-score table (from iteration 7)

`game.js` owns the state machine. Tests drive `createGame()` and
`step(dt)` (or a helper that advances many ticks). Do not put drawing
or DOM reads inside `step`.

## Coding guidance

- British English in comments, READMEs, and user-facing copy
  (“colour”, “initialise”, “centre”).
- Double quotes and trailing semicolons in JavaScript.
- Prefer small, named functions over large anonymous blocks.
- Keep collision and scoring logic pure and unit-tested.
- Cap ball speed so displacement per substep stays under half a brick
  thickness.
- Bat reflection uses the ball’s offset from the bat centre, with a
  minimum vertical component so the path cannot lock horizontal.
- Brick collisions resolve on the minimum-penetration axis.

## Iteration folders

Once an iteration is committed, do not retro-edit its gameplay. New
behaviour belongs in a new iteration folder, copied forward from the
previous one. You may fix a factual error in an earlier README only if
it would actively mislead a reader.

Each iteration folder must remain independently playable and must
include:

- `index.html`
- `README.md` explaining what this iteration adds and how it works
- `assets/kinetile-logo.jpg`
- `src/` with a complete game
- `tests/` covering the new mechanics plus carried-forward core
  behaviour (bat clamping, wall reflection, bat angle, brick hits, life
  loss, level determinism, power-up expiry, as applicable)

## Adding an iteration

1. Copy the previous iteration folder to `iteration-N/`.
2. Update the title, iteration number, and README.
3. Add the new mechanic in DOM-free modules first.
4. Extend the renderer and HUD.
5. Add cumulative tests for the new behaviour.
6. Run `npm test` from the repository root.
7. Commit that iteration on its own, following the commit guidance
   above.

## Tests

Vitest lives at the repository root only. `npm test` runs every
iteration’s specs. Game constructors should accept optional
dependencies (`rng`, `storage`, `audio`) so tests can inject fakes.

## Style for future agents

Match the module style of the latest iteration. Prefer extending
existing files over introducing a new abstraction unless the new
mechanic cannot sit cleanly in the current modules. Do not add a
bundler, TypeScript, or a game framework.
