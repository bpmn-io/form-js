import { FormContext, LocalExpressionContext } from '../../../../../src/render/context';

import { createMockInjector } from './mocks';

export const MockFormContext = (props) => {

  const {
    options = {},
    services = {},
    formId = 'foo'
  } = props;

  const formContext = {
    getService: (type, strict) => createMockInjector(services, options).get(type, strict),
    formId
  };

  const localExpressionContext = {
    parent: null,
    this: options.data,
    i: []
  };

  return (
    <LocalExpressionContext.Provider value={ localExpressionContext }>
      <FormContext.Provider value={ formContext }>
        { props.children }
      </FormContext.Provider>
    </LocalExpressionContext.Provider>
  );

};