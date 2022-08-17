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

    eventBus.on('form.init', function() {

      // emit <canvas.init> so dependent components can hook in
      // this is required to register keyboard bindings
      eventBus.fire('canvas.init', {
        svg: container,
        viewport: null
      });
    });

    // emit poor mans <element.hover> event
    // when hovering the form container
    container.addEventListener('mouseover', function() {
      eventBus.fire('element.hover');
    });

    // ensure we focus the container if the users clicks
    // inside; this follows input focus handling closely
    container.addEventListener('click', function(event) {

      // force focus when clicking container
      if (!container.contains(document.activeElement)) {
        container.focus({ preventScroll: true });
      }
    });

    eventBus.on('element.hover', function() {
      if (document.activeElement === document.body) {
        container.focus({ preventScroll: true });
      }
    });

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