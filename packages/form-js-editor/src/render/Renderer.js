import { render } from 'preact';
import { useState } from 'preact/hooks';

import FormEditor from './components/FormEditor';

import { FormEditorContext } from './context';

/**
 * @typedef { { container: Element, compact?: boolean } } RenderConfig
 * @typedef { import('didi').Injector } Injector
 * @typedef { import('../core/EventBus').default } EventBus
 * @typedef { import('../FormEditor').default } FormEditor
 */

/**
 * @param {RenderConfig} renderConfig
 * @param {EventBus} eventBus
 * @param {FormEditor} formEditor
 * @param {Injector} injector
 */
export default class Renderer {
  constructor(renderConfig, eventBus, formEditor, injector) {

    const {
      container,
      compact = false
    } = renderConfig;

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
        <div class={ `fjs-container fjs-editor-container ${ compact ? 'fjs-editor-compact' : '' }` }>
          <FormEditorContext.Provider value={ formEditorContext }>
            <FormEditor />
          </FormEditorContext.Provider>
        </div>
      );
    };

    eventBus.on('form.init', () => {
      render(<App />, container);
    });

    eventBus.on('form.destroy', () => {
      render(null, container);
    });
  }
}

Renderer.$inject = [ 'config.renderer', 'eventBus', 'formEditor', 'injector' ];