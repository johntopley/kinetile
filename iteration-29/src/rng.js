export function mulberry32(seed) {
  let a = seed >>> 0;
  function random() {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  random.getState = () => a >>> 0;
  return random;
}

export function seedForLevel(baseSeed, level) {
  return (baseSeed + level * 9973) >>> 0;
}
