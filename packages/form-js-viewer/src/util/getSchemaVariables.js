import { FeelExpressionLanguage } from '../features/expressionLanguage/FeelExpressionLanguage.js';
import { FeelersTemplating } from '../features/expressionLanguage/FeelersTemplating.js';
import { FormFields } from '../render/FormFields.js';

import { get } from 'min-dash';

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
  'valuesExpression',
  'url',
  'dataSource',
  'columnsExpression'
];

const TEMPLATE_PROPERTIES = [
  'alt',
  'appearance.prefixAdorner',
  'appearance.suffixAdorner',
  'description',
  'label',
  'source',
  'text',
  'content',
  'url'
];

/**
 * @typedef { import('../types').Schema } Schema
 */

/**
 * Parse the schema for variables a form might make use of.
 *
 * @example
 *
 * // retrieve variables from schema
 * const variables = getSchemaVariables(schema);
 *
 * @example
 *
 * // retrieve input variables from schema
 * const inputVariables = getSchemaVariables(schema, { outputs: false });
 *
 * @example
 *
 * // retrieve output variables from schema
 * const outputVariables = getSchemaVariables(schema, { inputs: false });
 *
 * @param {Schema} schema
 * @param {object} [options]
 * @param {any} [options.expressionLanguage]
 * @param {any} [options.templating]
 * @param {any} [options.formFields]
 * @param {boolean} [options.inputs=true]
 * @param {boolean} [options.outputs=true]
 *
 * @return {string[]}
 */
export function getSchemaVariables(schema, options = {}) {

  const {
    formFields = new FormFields(),
    expressionLanguage = new FeelExpressionLanguage(null),
    templating = new FeelersTemplating(),
    inputs = true,
    outputs = true
  } = options;

  if (!schema.components) {
    return [];
  }

  const getAllComponents = (node) => {
    const components = [];

    if (node.components) {
      node.components.forEach(component => {
        components.push(component);
        components.push(...getAllComponents(component));
      });
    }

    return components;
  };

  const variables = getAllComponents(schema).reduce((variables, component) => {

    const {
      valuesKey
    } = component;

    // collect input-only variables
    if (inputs) {

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

    }

    return variables.filter(variable => typeof variable === 'string');
  }, []);

  const getBindingVariables = (node)=> {
    const bindingVariable = [];
    const formField = formFields.get(node.type);

    if (formField && formField.config.keyed && node.key) {
      return [ node.key.split('.')[0] ];
    } else if (formField && formField.config.pathed && node.path) {
      return [ node.path.split('.')[0] ];
    } else if (node.components) {
      node.components.forEach(component => {
        bindingVariable.push(...getBindingVariables(component));
      });
    }

    return bindingVariable;
  };

  // collect binding variables
  if (inputs || outputs) {
    variables.push(...getBindingVariables(schema));
  }

  // remove duplicates
  return Array.from(new Set(variables));
}