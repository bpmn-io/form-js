import { FormContext } from '../../../../../../src/render/context';

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const {
      data,
      errors,
      evaluateExpression,
      properties,
      initialData
    } = options;

    if (type === 'form') {
      return {
        _getState() {
          return {
            data,
            errors,
            properties,
            initialData
          };
        }
      };
    } else if (type === 'conditionChecker') {
      return {
        evaluate(...args) {
          return evaluateExpression(...args);
        }
      };
    }
  }

  const formContext = {
    getService,
    formId
  };

  return (
    <FormContext.Provider value={ formContext }>
      { Component }
    </FormContext.Provider>
  );
}