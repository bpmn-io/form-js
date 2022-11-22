import { getVariableNames } from './feel';

export * from './injector';
export * from './form';

export function findErrors(errors, path) {
  return errors[ pathStringify(path) ];
}

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

export function pathStringify(path) {
  if (!path) {
    return '';
  }

  return path.join('.');
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
 * Parse the schema for input variables a form might make use of
 *
 * @param {any} schema
 *
 * @return {string[]}
 */
export function getSchemaVariables(schema) {

  if (!schema.components) {
    return [];
  }

  const variables = schema.components.reduce((variables, component) => {

    const {
      key,
      valuesKey,
      type,
      conditional
    } = component;

    if ([ 'text', 'button' ].includes(type)) {
      return variables;
    }

    if (key) {
      variables = [ ...variables, key ];
    }

    if (valuesKey) {
      variables = [ ...variables, valuesKey ];
    }

    if (conditional && conditional.hide) {

      // cut off initial '='
      const conditionVariables = getVariableNames(conditional.hide.slice(1));

      variables = [ ...variables, ...conditionVariables ];
    }

    return variables;
  }, []);

  // remove duplicates
  return Array.from(new Set(variables));
}