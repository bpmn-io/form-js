import { FormCore } from './core';
import { FormRenderer } from './rendering';

const schemaVersion = 1;

export * from './core';

export * from './rendering';

export * from './util';

export { schemaVersion };

/**
 * @typedef { { container: Element; schema: any; data: any; properties?: any } } FormViewerOptions
 */

/**
 * Create a form.
 *
 * @param {FormViewerOptions} options
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