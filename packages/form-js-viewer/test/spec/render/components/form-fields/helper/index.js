import { FormContext } from '../../../../../../src/render/context';

import { MarkdownRenderer, FeelersTemplating } from '../../../../../../src';

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const defaultTemplating = new FeelersTemplating();

    const {
      data,
      errors,
      isExpression,
      evaluateExpression,
      isTemplate = defaultTemplating.isTemplate,
      evaluateTemplate = defaultTemplating.evaluate,
      markdownRenderer = new MarkdownRenderer(),
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