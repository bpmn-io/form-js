import {
  FormEditorContext
} from '../../../../src/render/context';


export function WithFormEditorContext(Component, services = {}) {
  const formEditorContext = {
    getService(type, strict) {
      if (services[ type ]) {
        return services[ type ];
      }

      if (type === 'config') {
        return {
          propertiesPanel: {
            debounce: false
          }
        };
      } else if (type === 'debounce') {
        return fn => fn;
      } else if (type === 'eventBus') {
        return {
          fire() {},
          on() {},
          off() {}
        };
      } else if (type === 'formFieldRegistry') {
        return {
          add() {},
          remove() {},
          get() {},
          getAll() {
            return [];
          },
          forEach() {},
          clear() {}
        };
      }
    }
  };

  return (
    <FormEditorContext.Provider value={ formEditorContext }>
      { Component }
    </FormEditorContext.Provider>
  );
}