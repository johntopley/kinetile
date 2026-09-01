# Kinetile

![Kinetile logo](assets/kinetile-logo.jpg)

Kinetile is a Breakout/Arkanoid-style game that runs locally in a web
browser with keyboard controls. The project is built as fourteen
complete snapshots: each `iteration-N/` folder is a playable game at
that point in the design. All fourteen are present and independently
playable.

Iterations 1–5 are monochrome. Colour, sound, scoring, power-ups, and
tougher bricks arrive in later snapshots.

## Play

Serve the repository root and open the landing page, or open any
iteration folder directly:

```bash
npm start
```

Then visit [http://localhost:3000](http://localhost:3000).

Keyboard:

- **Left / A** — move the bat left
- **Right / D** — move the bat right
- **Space / Enter** — start, serve, fire lasers (from iteration 9),
  confirm a high-score name
- **Escape** — return to the title screen from game over

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

See [AGENTS.md](AGENTS.md) for design notes, coding conventions, and
commit message guidance.
