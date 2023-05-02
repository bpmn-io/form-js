import { FormEditorContext } from '../../../../../../src/render/context';
import { FormContext } from '@bpmn-io/form-js-viewer';
import showdown from 'showdown';

class MarkdownRenderer {
  constructor() {
    showdown.setFlavor('github');
    this._converter = new showdown.Converter();
  }

  render(markdown) {
    return this._converter.makeHtml(markdown);
  }
}

MarkdownRenderer.$inject = [];

export function WithEditorFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const {
      isExpression,
      isTemplate,
    } = options;

    if (type === 'form') {
      return {
        _getState() {
          return {
            initialData: {},
            data: {},
            errors: {},
            properties: {
              disabled: true
            }
          };
        }
      };
    } else if (type === 'templating') {
      return { isTemplate };
    } else if (type === 'expressionLanguage') {
      return { isExpression };
    } else if (type === 'markdownRenderer') {
      return new MarkdownRenderer();
    }
  }

  const formEditorContext = {
    getService,
    formId
  };

  return (
    <FormContext.Provider value={ formEditorContext }>
      <FormEditorContext.Provider value={ formEditorContext }>
        { Component }
      </FormEditorContext.Provider>
    </FormContext.Provider>
  );
}