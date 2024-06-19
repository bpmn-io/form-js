import { render } from 'preact';
import { Form } from './form-js-viewer-preact';

function renderForm(options = {}) {
  const { container, context, schema } = options;

  if (container === null) {
    return;
  }

  console.log({ context, schema });

  render(<Form schema={schema} context={context} />, container);
}

export { renderForm };
