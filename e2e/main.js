import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';

import './theme.scss';

import { FormPlayground, FormEditor, Form } from '@bpmn-io/form-js';
import emptySchema from './visual/fixtures/empty.json';

const COMPONENTS = {
  editor: FormEditor,
  viewer: Form,
  playground: FormPlayground,
};

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
      response.headers.get('content-type').includes('application/json')
    ) {
      return response.json();
    }

    return DEFAULT_SCHEMA;
  } catch {
    return DEFAULT_SCHEMA;
  }
}

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
