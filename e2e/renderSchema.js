import { FormPlayground, FormEditor, Form } from '@bpmn-io/form-js';
import emptySchema from './visual/fixtures/empty.json';

const DEFAULT_SCHEMA = {
  data: {
    component: 'playground',
    schema: emptySchema,
  },
};

async function fetchSchema() {
  try {
    const response = await fetch('/form');

    if (
      response.ok &&
      (response.headers.get('content-type') === null || !response.headers.get('content-type').includes('text/html'))
    ) {
      return response.json();
    }

    return DEFAULT_SCHEMA;
  } catch {
    return DEFAULT_SCHEMA;
  }
}

const COMPONENTS = {
  editor: FormEditor,
  viewer: Form,
  playground: FormPlayground,
};

function renderSchema() {
  fetchSchema().then((response) => {
    const data = response.data;

    const FormComponent = COMPONENTS[data.component || 'viewer'];

    const form = new FormComponent({
      container: document.querySelector('#container'),
      schema: data.schema,
      data: {},
    });

    if (data.component !== 'playground') {
      form.importSchema(data.schema);
    }
  });
}

export { renderSchema };
