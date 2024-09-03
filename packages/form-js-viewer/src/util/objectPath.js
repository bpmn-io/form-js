/**
 * @param {(string|number)[]} path
 * @returns {string}
 */
function valuePathArrayToString(path) {
  return /** @type {string} */ (
    path.reduce((/** @type {string} */ acc, key) => {
      if (acc.length === 0) {
        return typeof key === 'string' ? key : `[${key}]`;
      }

      return `${acc}${typeof key === 'string' ? `.${key}` : `[${key}]`}`;
    }, '')
  );
}

/**
 * @param {string} path
 * @returns {(string|number)[]}
 */
function pathStringToValuePathArray(path) {
  return path.split('.').map((key) => {
    if (key.startsWith('[') && key.endsWith(']')) {
      return parseInt(key.slice(1, -1), 10);
    }
    return key;
  });
}

export { valuePathArrayToString, pathStringToValuePathArray };
