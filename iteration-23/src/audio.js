function tone(ctx, { frequency, duration, type = "square", gain = 0.08, delay = 0 }) {
  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

const CUES = {
  serve: [{ frequency: 520, duration: 0.07, type: "triangle", gain: 0.05 }],
  wall: [{ frequency: 880, duration: 0.04, type: "square", gain: 0.04 }],
  paddle: [{ frequency: 196, duration: 0.08, type: "triangle", gain: 0.07 }],
  brick: [{ frequency: 660, duration: 0.06, type: "square", gain: 0.06 }],
  life: [
    { frequency: 330, duration: 0.12, type: "sawtooth", gain: 0.05 },
    { frequency: 196, duration: 0.18, type: "sawtooth", gain: 0.05, delay: 0.1 }
  ],
  clear: [
    { frequency: 523, duration: 0.1, type: "square", gain: 0.05 },
    { frequency: 659, duration: 0.1, type: "square", gain: 0.05, delay: 0.09 },
    { frequency: 784, duration: 0.16, type: "square", gain: 0.05, delay: 0.18 }
  ],
  power: [{ frequency: 784, duration: 0.1, type: "triangle", gain: 0.06 }],
  laser: [{ frequency: 980, duration: 0.05, type: "square", gain: 0.04 }],
  over: [
    { frequency: 147, duration: 0.22, type: "sawtooth", gain: 0.05 },
    { frequency: 110, duration: 0.3, type: "sawtooth", gain: 0.05, delay: 0.18 }
  ]
};

export function createSilentAudio() {
  const events = [];
  return {
    events,
    unlock() {},
    play(name) {
      events.push(name);
    }
  };
}

export function createAudio(contextFactory) {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      const Ctor = contextFactory ?? globalThis.AudioContext ?? globalThis.webkitAudioContext;
      if (!Ctor) {
        return null;
      }
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  return {
    unlock() {
      ensure();
    },
    play(name) {
      const audio = ensure();
      if (!audio) {
        return;
      }
      const notes = CUES[name] ?? CUES.brick;
      for (const note of notes) {
        tone(audio, note);
      }
    }
  };
}
