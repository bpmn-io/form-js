import { render } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { fields as defaultFieldRenderers } from './fields';

import Form from './Form';

import { FormContext } from './context';

import { findFieldRenderer } from '../util';

/**
 * @typedef { import('../core').FormCore } FormCore
 * @typedef { { additionalRenderers?: any[], container: Element, form: FormCore } } RendererOptions
 */

/**
 * @param {RendererOptions} options
 */
export default function FormRenderer(options) {
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

    const formContext = {
      get fields() {
        return form.fields;
      },
      get data() {
        return state.data;
      },
      get errors() {
        return state.errors;
      },
      get properties() {
        return state.properties;
      },
      getFieldRenderer(type) {
        return findFieldRenderer(renderers, type);
      }
    };

    form.on('changed', (newState) => {
      setState(newState);
    });

    const onChange = useCallback((update) => form.update(update), [ form ]);

    const { properties } = state;

    const { readOnly } = properties;

    const onSubmit = useCallback(() => {
      if (!readOnly) {
        form.submit();
      }
    }, [ form, readOnly ]);

    const onReset = useCallback(() => form.reset(), [ form ]);

    return (
      <FormContext.Provider value={ formContext }>
        <Form
          onChange={ onChange }
          onSubmit={ onSubmit }
          onReset={ onReset }
          schema={ state.schema } />
      </FormContext.Provider>
    );
  };

  render(<App />, container);
}