import { FormContext } from '@bpmn-io/form-js-viewer';

export function WithEditorFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    if (type === 'form') {
      return {
        _getState() {
          return {
            initialData: {},
            data: {},
            errors: {},
            properties: {
              readOnly: true
            }
          };
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