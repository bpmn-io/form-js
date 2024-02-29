import { Form } from './Form';

export { FormFieldRegistry, FormLayouter, Importer, FieldFactory, PathRegistry } from './core';
export * from './render';
export * from './util';
export * from './features';

const schemaVersion = 16;

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
    ...formOptions
  } = options;

  const form = new Form(formOptions);

  return form.importSchema(schema, data).then(function() {
    return form;
  });
}