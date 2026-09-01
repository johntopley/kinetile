export function createInput() {
  const down = new Set();
  const pressed = new Set();

  return {
    press(code) {
      if (!down.has(code)) {
        pressed.add(code);
      }
      down.add(code);
    },
    release(code) {
      down.delete(code);
    },
    isDown(code) {
      return down.has(code);
    },
    consume(code) {
      const wasPressed = pressed.has(code);
      pressed.delete(code);
      return wasPressed;
    },
    left() {
      return down.has("ArrowLeft") || down.has("KeyA");
    },
    right() {
      return down.has("ArrowRight") || down.has("KeyD");
    },
    consumeAction() {
      return this.consume("Space") || this.consume("Enter");
    },
    consumeEscape() {
      return this.consume("Escape");
    }
  };
}
