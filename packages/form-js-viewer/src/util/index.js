import { isString } from 'min-dash';

import { getExpressionVariableNames, getVariableNames } from './feel';

export * from './injector';
export * from './form';

const EXPRESSION_PROPERTIES = [
  'alt',
  'source',
  'text'
];

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

    if ([ 'button' ].includes(type)) {
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

    EXPRESSION_PROPERTIES.forEach((prop) => {
      const property = component[prop];

      if (property && isExpression(property)) {

        // cut off initial '='
        const expressionVariables = getExpressionVariableNames(property.slice(1));

        variables = [ ...variables, ...expressionVariables ];
      }
    });

    return variables;
  }, []);

  // remove duplicates
  return Array.from(new Set(variables));
}


// helper ///////////////

function isExpression(value) {
  return isString(value) && value.startsWith('=');
}