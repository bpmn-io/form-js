import Big from 'big.js';

/**
 * Checks whether a numeric string value would survive a Number() round-trip
 * without losing precision. This is relevant when serializeToString is not enabled,
 * since the value will be stored as a JavaScript Number (IEEE 754 double-precision),
 * which only supports ~15-17 significant digits.
 *
 * @param {string} value - The numeric string to check
 * @returns {boolean} true if Number(value).toString() represents the same numeric value
 */
export function isNumberInputSafe(value) {
  try {
    const bigOriginal = Big(value);
    const afterRoundTrip = Big(Number(value));
    return bigOriginal.eq(afterRoundTrip);
  } catch (e) {
    return false;
  }
}

export function countDecimals(number) {
  const num = Big(number);
  if (num.toString() === num.toFixed(0)) return 0;
  return num.toFixed().split('.')[1].length || 0;
}

export function isValidNumber(value) {
  return (typeof value === 'number' || typeof value === 'string') && value !== '' && !isNaN(Number(value));
}

export function willKeyProduceValidNumber(key, previousValue, caretIndex, selectionWidth, decimalDigits) {
  if (previousValue === 'NaN') {
    return false;
  }

  // Dot and comma are both treated as dot
  previousValue = previousValue.replace(',', '.');
  const isFirstDot = !previousValue.includes('.') && (key === '.' || key === ',');
  const isFirstMinus = !previousValue.includes('-') && key === '-' && caretIndex === 0;

  const keypressIsNumeric = /^[0-9]$/i.test(key);
  const dotIndex = previousValue === undefined ? -1 : previousValue.indexOf('.');

  // If the caret is positioned after a dot, and the current decimal digits count is equal or greater to the maximum, disallow the key press
  const overflowsDecimalSpace =
    typeof decimalDigits === 'number' &&
    selectionWidth === 0 &&
    dotIndex !== -1 &&
    previousValue.includes('.') &&
    previousValue.split('.')[1].length >= decimalDigits &&
    caretIndex > dotIndex;

  const keypressIsAllowedChar = keypressIsNumeric || (decimalDigits !== 0 && isFirstDot) || isFirstMinus;

  return keypressIsAllowedChar && !overflowsDecimalSpace;
}

export function isNullEquivalentValue(value) {
  return value === undefined || value === null || value === '';
}
