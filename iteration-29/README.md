# Iteration 29 — pause and save

![Kinetile logo](assets/kinetile-logo.jpg)

This snapshot is the finished local game. You can freeze a rally, write
the table to the same browser storage as the high-score list, and pick
the match up later from the title screen.

## What this iteration adds

- Pause during serve or play (`P` or Escape)
- A save written while paused (`S`)
- Continue from the title screen (`C`) when a save exists
- On-screen reminders of those keys on the title, HUD, and pause card
- A return to the title from pause (Escape) that leaves the save intact

## How it works

`PAUSED` is a new state. Entering it remembers whether the match was
on serve or in play; the clock, capsules, and effects do not advance
until the player resumes. Escape from pause goes home; `P` or Space
puts the rally back where it stopped.

`save.js` snapshots the table as JSON: score, lives, formation, balls,
effects, falling capsules, and the drop-rng state. `mulberry32` now
exposes `getState` so a later continue draws the same capsules as if
the tab had never closed. High scores stay on their own key.

A continue lands on the pause screen so a mid-flight ball cannot be
lost before the player is ready. The title only offers `C` when a
valid save is present; a corrupt or version-mismatched blob is ignored.

The canvas still has no iteration chrome. The new keys are taught on
the title captions, the serve/play HUD, the pause overlay, and the
page footer.

## Tests

New specs cover pausing without ticking the world, writing and
restoring a snapshot (including rng continuity), continuing from the
title, and rejecting a bad save.
