import { FormEditorContext } from '../../../../src/render/context';

export function WithFormEditorContext(Component, overrides = {}) {
  const formEditorContext = {
    getService(type, strict) {
      if (type === 'config') {
        return {
          propertiesPanel: {
            debounce: false
          }
        };
      } else if (type === 'eventBus') {
        return {
          fire() {},
          on() {},
          off() {}
        };
      } else if (type === 'debounce') {
        return fn => fn;
      }
    },
    ...overrides
  };

  return (
    <FormEditorContext.Provider value={ formEditorContext }>
      { Component }
    </FormEditorContext.Provider>
  );
}