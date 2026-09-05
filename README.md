# Kinetile

![Kinetile logo](assets/kinetile-logo.jpg)

Kinetile is a Breakout/Arkanoid-style game that runs locally in a web
browser with keyboard controls.

**The finished game is [iteration 29](iteration-29/).** Open that
folder to play the standalone product: no iteration chrome, the full
set of capsules, pause, and a local save. The earlier `iteration-N/`
folders are complete historical snapshots of the design. All
twenty-nine are independently playable.

Iterations 1–5 are monochrome. Colour, sound, scoring, power-ups, and
tougher bricks arrive in later snapshots.

## Play

Serve the repository root, then open the finished game (or the
landing page if you want the catalogue):

```bash
npm start
```

- Finished game: [http://localhost:3000/iteration-29/](http://localhost:3000/iteration-29/)
- All snapshots: [http://localhost:3000](http://localhost:3000)

Keyboard:

- **Left / A** — move the bat left
- **Right / D** — move the bat right
- **Space / Enter** — start, serve, fire lasers, throw a caught ball,
  confirm a high-score name, resume from pause
- **P** — pause and resume
- **S** — save the match while paused
- **C** — continue a saved game from the title screen
- **Escape** — pause, return to the title from pause or game over

## Tests

```bash
npm test
```

Vitest runs every iteration’s specs from the repository root. Game
logic is DOM-free so the suite does not need a browser.

## Iterations

| Folder | Theme |
| --- | --- |
| [iteration-1](iteration-1/) | Title screen and a movable bat |
| [iteration-2](iteration-2/) | Ball that bounces off walls and the bat |
| [iteration-3](iteration-3/) | Lives and game over |
| [iteration-4](iteration-4/) | Fixed 8×14 brick wall |
| [iteration-5](iteration-5/) | Random formations and levels |
| [iteration-6](iteration-6/) | Full colour and sound |
| [iteration-7](iteration-7/) | Scoring and high-score table |
| [iteration-8](iteration-8/) | Wider-bat power-up |
| [iteration-9](iteration-9/) | Laser bat power-up |
| [iteration-10](iteration-10/) | Piercing-ball power-up |
| [iteration-11](iteration-11/) | Multi-ball power-up |
| [iteration-12](iteration-12/) | Half-speed power-up |
| [iteration-13](iteration-13/) | Multi-hit bricks |
| [iteration-14](iteration-14/) | Shifting bricks |
| [iteration-15](iteration-15/) | Ornamented bat, bricks, and ball |
| [iteration-16](iteration-16/) | Catch power-up |
| [iteration-17](iteration-17/) | Extra-life capsule |
| [iteration-18](iteration-18/) | Break gate |
| [iteration-19](iteration-19/) | Barrier floor |
| [iteration-20](iteration-20/) | Reduce hazard |
| [iteration-21](iteration-21/) | Fast-ball hazard |
| [iteration-22](iteration-22/) | Reverse-controls hazard |
| [iteration-23](iteration-23/) | Fireball |
| [iteration-24](iteration-24/) | Twin bat |
| [iteration-25](iteration-25/) | Magnet bat |
| [iteration-26](iteration-26/) | Mystery capsule |
| [iteration-27](iteration-27/) | Ball-only Slow |
| [iteration-28](iteration-28/) | Standalone game |
| [iteration-29](iteration-29/) | **Finished game — play this** |

See [AGENTS.md](AGENTS.md) for design notes, coding conventions, and
commit message guidance.
