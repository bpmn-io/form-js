import { render } from 'preact';
import { useState } from 'preact/hooks';

import {
  fields as defaultFieldRenderers
} from './fields';

import Form from './Form';

import { FormContext } from './context';

import {
  findFieldRenderer
} from '../util';

/**
 * @typedef { import('../core').FormCore } FormCore
 * @typedef { { additionalRenderers?: any[], container: Element, form: FormCore } } RendererOptions
 */

const noop = () => {};

/**
 * @param {RendererOptions} options
 */
export default function Renderer(options) {
  const {
    additionalRenderers = [],
    container,
    form
  } = options;

  const renderers = [
    ...additionalRenderers,
    ...defaultFieldRenderers
  ];

  const App = (props) => {
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

    return (
      <FormContext.Provider value={ formContext }>
        <Form
          onChange={ (update) => form.update(update) }
          onSubmit={ state.properties.readOnly ? noop : () => form.submit() }
          onReset={ () => form.reset() }
          schema={ state.schema } />
      </FormContext.Provider>
    );
  };

  render(<App />, container);
}