import FeelExpressionLanguage from '../features/expression-language/FeelExpressionLanguage.js';
import FeelersTemplating from '../features/expression-language/FeelersTemplating.js';

import { get } from 'min-dash';

export * from './constants';
export * from './injector';
export * from './form';

const EXPRESSION_PROPERTIES = [
  'alt',
  'appearance.prefixAdorner',
  'appearance.suffixAdorner',
  'conditional.hide',
  'description',
  'label',
  'source',
  'readonly',
  'text',
  'validate.min',
  'validate.max',
  'validate.minLength',
  'validate.maxLength',
  'valuesExpression'
];

const TEMPLATE_PROPERTIES = [
  'alt',
  'appearance.prefixAdorner',
  'appearance.suffixAdorner',
  'description',
  'label',
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
export function getSchemaVariables(schema, expressionLanguage = new FeelExpressionLanguage(null), templating = new FeelersTemplating()) {

  if (!schema.components) {
    return [];
  }

  const variables = schema.components.reduce((variables, component) => {

    const {
      key,
      valuesKey,
      type
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

    EXPRESSION_PROPERTIES.forEach((prop) => {
      const property = get(component, prop.split('.'));

      if (property && expressionLanguage.isExpression(property)) {

        const expressionVariables = expressionLanguage.getVariableNames(property, { type: 'expression' });

        variables = [ ...variables, ...expressionVariables ];
      }
    });

    TEMPLATE_PROPERTIES.forEach((prop) => {
      const property = get(component, prop.split('.'));

      if (property && !expressionLanguage.isExpression(property) && templating.isTemplate(property)) {
        const templateVariables = templating.getVariableNames(property);
        variables = [ ...variables, ...templateVariables ];
      }
    });

    return variables.filter(variable => variable !== undefined || variable !== null);
  }, []);

  // remove duplicates
  return Array.from(new Set(variables));
}
