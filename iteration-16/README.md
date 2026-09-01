# Iteration 16 — catch

![Kinetile logo](assets/kinetile-logo.jpg)

A pale capsule makes the bat sticky, matching Arkanoid’s Catch. The
ball holds on contact. Space throws it again, using the offset from
the bat centre as the launch angle.

## What this iteration adds

- The `CATCH` power-up, time-limited to ten seconds
- Sticky contact instead of a bounce while the effect is live
- A Space release that serves every stuck ball
- An automatic release when the timer expires, so a ball cannot stay
  glued after the effect ends

## How it works

On a bat hit, `stickBallToPaddle` stores the contact offset and zeroes
the velocity. Each tick then glues the ball with `placeBallOnPaddle`,
so steering the bat also steers the held shot.

Space during play first asks whether any ball is stuck. If one is, it
is released and lasers wait. That keeps the serve key from firing a
volley by accident.

## Tests

New specs cover sticking on contact, following the bat, releasing on
Space, and a forced release when the timer runs out.
