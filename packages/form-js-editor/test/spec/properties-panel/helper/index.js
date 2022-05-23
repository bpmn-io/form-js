import {
  FormEditorContext
} from '../../../../src/render/context';

import { PropertiesPanel } from '@bpmn-io/properties-panel';

const noop = () => {};

const noopField = {
  id: 'foobar',
  type: 'default'
};

const noopHeaderProvider = {
  getElementLabel: noop,
  getElementIcon: noop,
  getTypeLabel: noop
};

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
          clear() {},
          _ids: {
            assigned() {
              return false;
            }
          },
          _keys: {
            assigned() {
              return false;
            }
          },
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

export function WithPropertiesPanel(options = {}) {

  const {
    field = noopField,
    groups = [],
    headerProvider = noopHeaderProvider
  } = options;

  return (
    <PropertiesPanel
      element={ field }
      groups={ groups }
      headerProvider={ headerProvider }
    />
  );
}