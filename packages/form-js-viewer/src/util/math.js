/**
 * Fuzzy divide a number into parts.
 *
 * @param {number} a
 * @param {number} b
 *
 * @returns {Array<number>}
 */

const fuzzyDivide = (a, b) => {

  const base = Math.floor(a / b);
  const remainder = a % b;
  const parts = new Array(b).fill(base);

  for (let i = 0; i < remainder; i++) {
    parts[i] += 1;
  }

  return parts;
};

export { fuzzyDivide };