import { FormContext } from '../../../../../../src/render/context';

import { MarkdownRenderer, FeelersTemplating, FormFields } from '../../../../../../src';

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const defaultTemplating = new FeelersTemplating();

    const {
      data,
      errors = {},
      isExpression = () => false,
      evaluateExpression,
      isTemplate = defaultTemplating.isTemplate,
      evaluateTemplate = defaultTemplating.evaluate,
      markdownRenderer = new MarkdownRenderer(),
      formFields = new FormFields(),
      children = [],
      updateFieldValidation,
      eventBusFire = () => {},
      properties = {},
      initialData
    } = options;

    if (type === 'eventBus') {
      return {
        fire: eventBusFire
      };
    } else if (type === 'form') {
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
    } else if (type === 'formFields') {
      return formFields;
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
    } else if (type === 'viewerCommands') {
      return {
        updateFieldValidation(...args) {
          return updateFieldValidation(...args);
        }
      };
    } else if (type === 'formLayouter') {
      return { getRows: () => children.map((child) => ({ components: [ child.id ] })) };
    } else if (type === 'formFieldRegistry') {
      return {
        get: (id) => {
          return children.find((child) => child.id === id);
        }
      };
    } else if (type === 'pathRegistry') {
      return {
        getValuePath: (field) => {
          return field.key;
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