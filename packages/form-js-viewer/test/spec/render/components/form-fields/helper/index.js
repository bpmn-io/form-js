import { FormContext } from '../../../../../../src/render/context';

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const {
      data,
      errors,
      isExpression,
      evaluateExpression,
      isTemplate,
      evaluateTemplate,
      markdownRenderer,
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
        applyConditions() {},
        check() {}
      };
    } else if (type === 'templating') {
      return {
        isTemplate,
        evaluate(...args) {
          return evaluateTemplate(...args);
        }
      };
    } else if (type === 'markdownRenderer') {
      return markdownRenderer;
    } else if (type === 'expressionLanguage') {
      return {
        isExpression,
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