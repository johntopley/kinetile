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
    },
    consumeBackspace() {
      return this.consume("Backspace");
    },
    consumeLetter() {
      for (const code of [...pressed]) {
        if (code.startsWith("Key") && code.length === 4) {
          pressed.delete(code);
          return code.slice(3);
        }
      }
      return null;
    }
  };
}
