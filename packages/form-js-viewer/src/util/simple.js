export function isRequired(field) {
  return field.required;
}

export function pathParse(path) {
  if (!path) {
    return [];
  }

  return path.split('.').map(key => {
    return isNaN(parseInt(key)) ? key : parseInt(key);
  });
}

export function pathsEqual(a, b) {
  return (
    a &&
    b &&
    a.length === b.length &&
    a.every((value, index) => value === b[ index ])
  );
}

const indices = {};

export function generateIndexForType(type) {
  if (type in indices) {
    indices[ type ]++;
  } else {
    indices[ type ] = 1;
  }

  return indices[ type ];
}

export function generateIdForType(type) {
  return `${ type }${ generateIndexForType(type) }`;
}

/**
 * @template T
 * @param {T} data
 * @param {(this: any, key: string, value: any) => any} [replacer]
 * @return {T}
 */
export function clone(data, replacer) {
  return JSON.parse(JSON.stringify(data, replacer));
}

/**
 * Wrap an expression context with additional local context.
 * A version of the local context with underscore-wrapped keys is also injected as fallback.
 *
 * @param {Object} baseContext - The context to wrap.
 * @param {Object} localContext - The local context object.
 * @returns {Object} The merged context object.
 */
export function wrapExpressionContext(baseContext, localContext) {
  return {
    ...localContext,
    ...baseContext,
    ..._wrapObjectKeysWithUnderscores(localContext)
  };
}

export function runRecursively(formField, fn) {
  const components = formField.components || [];

  components.forEach((component, index) => {
    runRecursively(component, fn);
  });

  fn(formField);
}

// helpers //////////////////////

function _wrapObjectKeysWithUnderscores(obj) {
  const newObj = {};
  for (const [ key, value ] of Object.entries(obj)) {
    newObj[`_${key}_`] = value;
  }
  return newObj;
}