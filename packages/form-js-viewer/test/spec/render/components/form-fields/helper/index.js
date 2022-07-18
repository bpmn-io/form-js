import { FormContext } from '../../../../../../src/render/context';

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const {
      data,
      errors,
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