import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';

import './theme.scss';

import { FormPlayground, FormEditor, Form } from '@bpmn-io/form-js';

const COMPONENTS = {
  'editor': FormEditor,
  'viewer': Form,
  'playground': FormPlayground
};

fetch('/form').then(response => {

  if (!response.ok) {
    throw new Error('failed to fetch form');
  }

  return response.json();

}).then((response) => {

  const data = response.data;

  const FormComponent = COMPONENTS[data.component || 'viewer'];

  const form = new FormComponent({
    container: document.querySelector('#container'),
    schema: data.schema,
    data: {}
  });

  if (data.component !== 'playground') {
    form.importSchema(data.schema);
  }
});
