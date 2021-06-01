import { render } from 'preact';
import { useState } from 'preact/hooks';

import FormEditor from './components/FormEditor';

import { FormEditorContext } from './context';

/**
 * @typedef { { container } } Config
 * @typedef {any} EventBus
 * @typedef {Map} formFieldRegistry
 * @typedef { import('../FormEditor').default } FormEditor
 */

/**
 * @param {Config} config
 * @param {EventBus} eventBus
 * @param {FormEditor} formEditor
 * @param { import('didi').Injector } injector
 */
export default class Renderer {
  constructor(config, eventBus, formEditor, injector) {

    const App = () => {
      const [ state, setState ] = useState(formEditor._getState());

      const formEditorContext = {
        getService(type, strict = true) {
          return injector.get(type, strict);
        }
      };

      formEditor.on('changed', (newState) => {
        setState(newState);
      });

      const { schema } = state;

      if (!schema) {
        return null;
      }

      return (
        <div class="fjs-container fjs-editor-container">
          <FormEditorContext.Provider value={ formEditorContext }>
            <FormEditor />
          </FormEditorContext.Provider>
        </div>
      );
    };

    eventBus.on('form.init', () => {
      const { container } = config;

      render(<App />, container);
    });
  }
}

Renderer.$inject = [ 'config.renderer', 'eventBus', 'formEditor', 'injector' ];