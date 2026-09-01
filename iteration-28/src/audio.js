function tone(ctx, { frequency, duration, type = "square", gain = 0.08, delay = 0, glide }) {
  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (glide) {
    oscillator.frequency.exponentialRampToValueAtTime(glide, start + duration);
  }
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function powerCueName(type) {
  return `power${type}`;
}

export const CUES = {
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
  laser: [{ frequency: 980, duration: 0.05, type: "square", gain: 0.04 }],
  over: [
    { frequency: 147, duration: 0.22, type: "sawtooth", gain: 0.05 },
    { frequency: 110, duration: 0.3, type: "sawtooth", gain: 0.05, delay: 0.18 }
  ],
  powerWIDE: [
    { frequency: 262, duration: 0.08, type: "triangle", gain: 0.07 },
    { frequency: 330, duration: 0.09, type: "triangle", gain: 0.07, delay: 0.06 },
    { frequency: 392, duration: 0.16, type: "triangle", gain: 0.08, delay: 0.13 }
  ],
  powerLASER: [
    { frequency: 1180, duration: 0.04, type: "square", gain: 0.055 },
    { frequency: 1540, duration: 0.05, type: "square", gain: 0.05, delay: 0.03 },
    { frequency: 1980, duration: 0.04, type: "square", gain: 0.04, delay: 0.07 }
  ],
  powerPIERCE: [
    { frequency: 880, duration: 0.05, type: "square", gain: 0.055 },
    { frequency: 1320, duration: 0.12, type: "triangle", gain: 0.06, delay: 0.04 }
  ],
  powerMULTI: [
    { frequency: 494, duration: 0.07, type: "square", gain: 0.055 },
    { frequency: 622, duration: 0.07, type: "square", gain: 0.055, delay: 0.05 },
    { frequency: 740, duration: 0.1, type: "square", gain: 0.06, delay: 0.1 }
  ],
  powerSLOW: [
    { frequency: 440, duration: 0.14, type: "sine", gain: 0.07, glide: 196 }
  ],
  powerCATCH: [
    { frequency: 349, duration: 0.06, type: "triangle", gain: 0.06 },
    { frequency: 523, duration: 0.14, type: "sine", gain: 0.07, delay: 0.05 }
  ],
  powerPLAYER: [
    { frequency: 523, duration: 0.08, type: "square", gain: 0.06 },
    { frequency: 659, duration: 0.08, type: "square", gain: 0.06, delay: 0.07 },
    { frequency: 784, duration: 0.08, type: "square", gain: 0.06, delay: 0.14 },
    { frequency: 1047, duration: 0.18, type: "triangle", gain: 0.07, delay: 0.22 }
  ],
  powerBREAK: [
    { frequency: 784, duration: 0.08, type: "sine", gain: 0.06 },
    { frequency: 988, duration: 0.2, type: "triangle", gain: 0.07, delay: 0.07 }
  ],
  powerBARRIER: [
    { frequency: 147, duration: 0.1, type: "square", gain: 0.06 },
    { frequency: 294, duration: 0.16, type: "triangle", gain: 0.055, delay: 0.08 }
  ],
  powerREDUCE: [
    { frequency: 392, duration: 0.08, type: "sawtooth", gain: 0.05 },
    { frequency: 247, duration: 0.16, type: "sawtooth", gain: 0.055, delay: 0.08 }
  ],
  powerFAST: [
    { frequency: 330, duration: 0.16, type: "square", gain: 0.06, glide: 1320 }
  ],
  powerREVERSE: [
    { frequency: 587, duration: 0.07, type: "triangle", gain: 0.06 },
    { frequency: 440, duration: 0.07, type: "triangle", gain: 0.06, delay: 0.06 },
    { frequency: 587, duration: 0.1, type: "triangle", gain: 0.06, delay: 0.12 }
  ],
  powerFIREBALL: [
    { frequency: 196, duration: 0.08, type: "sawtooth", gain: 0.055 },
    { frequency: 311, duration: 0.08, type: "sawtooth", gain: 0.06, delay: 0.05 },
    { frequency: 466, duration: 0.14, type: "sawtooth", gain: 0.055, delay: 0.1, glide: 698 }
  ],
  powerTWIN: [
    { frequency: 392, duration: 0.16, type: "triangle", gain: 0.05 },
    { frequency: 588, duration: 0.16, type: "triangle", gain: 0.05, delay: 0.02 }
  ],
  powerMAGNET: [
    { frequency: 220, duration: 0.2, type: "sine", gain: 0.07, glide: 660 }
  ],
  powerMYSTERY: [
    { frequency: 415, duration: 0.06, type: "square", gain: 0.05 },
    { frequency: 311, duration: 0.06, type: "square", gain: 0.05, delay: 0.05 },
    { frequency: 554, duration: 0.06, type: "square", gain: 0.055, delay: 0.1 },
    { frequency: 740, duration: 0.14, type: "triangle", gain: 0.06, delay: 0.16 }
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
