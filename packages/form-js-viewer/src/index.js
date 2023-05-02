import Form from './Form';

export { FormFieldRegistry, FormLayouter } from './core';
export * from './render';
export * from './util';
export * from './features';

const schemaVersion = 9;

export {
  Form,
  schemaVersion
};

/**
 * @typedef { import('./types').CreateFormOptions } CreateFormOptions
 */

/**
 * Create a form.
 *
 * @param {CreateFormOptions} options
 *
 * @return {Promise<Form>}
 */
export function createForm(options) {
  const {
    data,
    schema,
    ...rest
  } = options;

  const form = new Form(rest);

  return form.importSchema(schema, data).then(function() {
    return form;
  });
}