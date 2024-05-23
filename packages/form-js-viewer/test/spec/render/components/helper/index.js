import { FormContext, ExpressionContextInfo } from '../../../../../src/render/context';

import { createMockInjector } from './mocks';

export const MockFormContext = (props) => {
  const { options = {}, services = {}, formId = 'foo' } = props;

  const formContext = {
    getService: (type, strict) => createMockInjector(services, options).get(type, strict),
    formId,
  };

  const data = options.data || options.initialData || {};

  const expressionContextInfo = {
    data,
    segments: [],
  };

  return (
    <ExpressionContextInfo.Provider value={expressionContextInfo}>
      <FormContext.Provider value={formContext}>{props.children}</FormContext.Provider>
    </ExpressionContextInfo.Provider>
  );
};
