import Form from './Form';

export * from './render';
export * from './util';

const schemaVersion = 1;

export {
  Form,
  schemaVersion
};

/**
 * @typedef { import('didi').Injector } Injector
 *
 * @typedef { { [x: string]: any } } Data
 * @typedef { any } Schema
 * @typedef { any[] } Modules
 * @typedef { { [x: string]: any } } FormPropertyOptions
 *
 * @typedef { {
 *   additionalModules?: Modules,
 *   container?: Element|string,
 *   data?: Data,
 *   injector?: Injector,
 *   modules?: Modules,
 *   properties?: FormPropertyOptions,
 *   schema: Schema
 * } } FormViewerOptions
 */

/**
 * Create a form.
 *
 * @param {FormViewerOptions} options
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