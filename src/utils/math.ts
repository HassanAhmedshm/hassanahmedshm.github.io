// Linear interpolation
export const lerp = (start, end, factor) => start + (end - start) * factor;

// Clamp value between min and max
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Map value from one range to another
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Random between min and max
export const random = (min, max) => Math.random() * (max - min) + min;

// Seeded random - deterministic based on index
export const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Map seeded random to range
export const seededRandomRange = (seed, min, max) => {
  return seededRandom(seed) * (max - min) + min;
};

// Smooth step interpolation
export const smoothStep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};