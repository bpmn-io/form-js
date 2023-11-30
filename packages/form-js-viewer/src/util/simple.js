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
 * Transform a LocalExpressionContext object into a usable FEEL context.
 *
 * @param {Object} context - The LocalExpressionContext object.
 * @returns {Object} The usable FEEL context.
 */

export function buildExpressionContext(context) {
  const {
    data,
    ...specialContextKeys
  } = context;

  return {
    ...specialContextKeys,
    ...data,
    ..._wrapObjectKeysWithUnderscores(specialContextKeys)
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