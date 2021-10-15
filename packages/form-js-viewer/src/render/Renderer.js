import { render } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import FormComponent from './components/FormComponent';

import { FormContext } from './context';

/**
 * @typedef { { container } } Config
 * @typedef { import('didi').Injector } Injector
 * @typedef { import('../core/EventBus').default } EventBus
 * @typedef { import('../Form').default } Form
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
      },
      formId: form._id
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
        <FormComponent
          onChange={ onChange }
          onSubmit={ onSubmit }
          onReset={ onReset } />
      </FormContext.Provider>
    );
  };

  const { container } = config;

  eventBus.on('form.init', () => {
    render(<App />, container);
  });

  eventBus.on('form.destroy', () => {
    render(null, container);
  });
}

Renderer.$inject = [ 'config.renderer', 'eventBus', 'form', 'injector' ];