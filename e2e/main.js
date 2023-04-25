import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';

import { FormPlayground } from '@bpmn-io/form-js';

const schema = {
  schemaVersion: 8,
  exporter: {
    name: 'Camunda Web Modeler',
    version: '0de37f6'
  },
  components: [],
  type: 'default',
  id: 'form_id',
  executionPlatform: 'Camunda Cloud',
  executionPlatformVersion: '8.2.0'
};

new FormPlayground({
  container: document.querySelector('#container'),
  schema,
  data: {}
});
