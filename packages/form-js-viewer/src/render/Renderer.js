import { render } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import Form from './components/Form';

import { FormContext } from './context';

/**
 * @typedef { { container } } Config
 * @typedef {any} EventBus
 * @typedef {Map} formFieldRegistry
 * @typedef { import('../Form').default } Form
 * @typedef {any} Injector
 */

/**
 * @param {Config} config
 * @param {EventBus} eventBus
 * @param {Form} form
 * @param {Injector} injector
 */
export default function Renderer(config, eventBus, form, injector) {

  const App = () => {
    const [ state, setState ] = useState(form._getState());

    const formContext = {
      getService(type, strict = true) {
        return injector.get(type, strict);
      }
    };

    eventBus.on('changed', (newState) => {
      setState(newState);
    });

    const onChange = useCallback((update) => form._update(update), [ form ]);

    const { properties } = state;

    const { readOnly } = properties;

    const onSubmit = useCallback(() => {
      if (!readOnly) {
        form.submit();
      }
    }, [ form, readOnly ]);

    const onReset = useCallback(() => form.reset(), [ form ]);

    const { schema } = state;

    if (!schema) {
      return null;
    }

    return (
      <FormContext.Provider value={ formContext }>
        <Form
          onChange={ onChange }
          onSubmit={ onSubmit }
          onReset={ onReset } />
      </FormContext.Provider>
    );
  };

  eventBus.on('form.init', () => {
    const { container } = config;

    render(<App />, container);
  });
}

Renderer.$inject = [ 'config.renderer', 'eventBus', 'form', 'injector' ];