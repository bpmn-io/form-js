import { render } from 'preact';
import { useState } from 'preact/hooks';

import FormEditor from './FormEditor';

import { FormEditorContext } from './context';

import {
  findFieldRenderer,
  fields as defaultFieldRenderers
} from '@bpmn-io/form-js-viewer';

export default class FormEditorRenderer {
  constructor(options = {}) {
    const {
      additionalRenderers = [],
      container,
      form
    } = options;

    const renderers = [
      ...additionalRenderers,
      ...defaultFieldRenderers
    ];

    const App = () => {
      const [ state, setState ] = useState(form.getState());

      const formEditorContext = {
        get fields() {
          return form.fields;
        },
        get properties() {
          return state.properties;
        },
        getFieldRenderer(type) {
          return findFieldRenderer(renderers, type);
        },
        get fieldRenderers() {
          return renderers;
        },
        addField(...args) {
          form.addField(...args);
        },
        editField(...args) {
          form.editField(...args);
        },
        moveField(...args) {
          form.moveField(...args);
        },
        removeField(...args) {
          form.removeField(...args);
        },
        emit(event, data) {
          form.emitter.emit(event, data);
        }
      };

      form.on('changed', (newState) => {
        setState(newState);
      });

      return (
        <div class="fjs-container">
          <FormEditorContext.Provider value={ formEditorContext }>
            <FormEditor
              schema={ state.schema } />
          </FormEditorContext.Provider>
        </div>
      );
    };

    render(<App />, container);
  }
}