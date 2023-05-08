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

fetch('/form')
  .then((response) => {
    if (response.ok) {
      return response.json();
    }

    return Promise.resolve({
      data: {
        component: 'playground',
        schema: emptySchema,
      },
    });
  })
  .then((response) => {
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
  })
  .catch(() => {
    new FormPlayground({
      container: document.querySelector('#container'),
      schema: emptySchema,
      data: {},
    });
  });


