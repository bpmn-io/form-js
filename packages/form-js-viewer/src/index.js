import { FormCore } from './core';
import { FormRenderer } from './rendering';

export * from './rendering';

export * from './util';

/**
 * @typedef { { container: Element; schema: any; data: any; properties?: any } } FormOptions
 */

/**
 * Create a form.
 *
 * @param {FormOptions} options
 *
 * @return {FormCore}
 */
export function createForm(options) {

  const {
    container,
    schema,
    data,
    properties = {}
  } = options;

  const form = new FormCore({
    schema,
    data,
    properties
  });

  new FormRenderer({
    container,
    form
  });

  return form;
}