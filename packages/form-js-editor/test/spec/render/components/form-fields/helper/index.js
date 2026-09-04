import { FormEditorContext } from '../../../../../../src/render/context';
import { testTranslate } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';
import { FormContext } from '@bpmn-io/form-js-viewer';
import { marked } from 'marked';

class MarkdownRenderer {
  render(markdown) {
    return marked.parse(markdown, {
      gfm: true,
      breaks: true,
    });
  }
}

MarkdownRenderer.$inject = [];

export function WithEditorFormContext(Component, options = {}, formId = 'foo') {
  function getService(type, strict) {
    const { isExpression, isTemplate } = options;

    if (type === 'form') {
      return {
        _getState() {
          return {
            initialData: {},
            data: {},
            errors: {},
            properties: {
              disabled: true,
            },
          };
        },
      };
    } else if (type === 'templating') {
      return { isTemplate };
    } else if (type === 'expressionLanguage') {
      return { isExpression };
    } else if (type === 'markdownRenderer') {
      return new MarkdownRenderer();
    } else if (type === 'translate') {
      return testTranslate;
    }
  }

  const formEditorContext = {
    getService,
    formId,
  };

  return (
    <FormContext.Provider value={formEditorContext}>
      <FormEditorContext.Provider value={formEditorContext}>{Component}</FormEditorContext.Provider>
    </FormContext.Provider>
  );
}
