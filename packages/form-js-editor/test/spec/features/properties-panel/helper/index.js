import { PropertiesPanel } from '@bpmn-io/properties-panel';
import { FormEditorContext } from '../../../../../src/render/context';

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

export class Modeling {
  constructor(options = {}) {
    this._editFormField = options.editFormField || noop;
  }

  editFormField(formField, key, value) {
    return this._editFormField(formField, key, value);
  }
}

export class Selection {
  constructor(options = {}) {
    this._selection = options.selection;
  }

  get() {
    return this._selection;
  }
}

export class FormFieldRegistry {

  constructor() {
    this._ids = {
      assigned() {
        return false;
      }
    };

    this._keys = {
      assigned() {
        return false;
      }
    };
  }

  add() {}
  remove() {}
  get() {}
  getAll() {
    return [];
  }
  forEach() {}
  clear() {}
}

export class FormEditor {

  constructor(options = {}) {
    this._state = options.state || {
      schema: {},
      properties: {}
    };
  }

  getSchema() {
    return this._state.schema;
  }

  _getState() {
    return this._state;
  }
}

export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, priority, callback) {
    if (!callback) {
      callback = priority;
    }

    if (!this.listeners[ event ]) {
      this.listeners[ event ] = [];
    }

    this.listeners[ event ].push(callback);
  }

  off() {}

  fire(event, context) {
    if (this.listeners[ event ]) {
      this.listeners[ event ].forEach(callback => callback(context));
    }
  }
}

export class Injector {

  constructor(options = {}) {
    this._options = options;
  }

  get(type) {

    if (type === 'formEditor') {
      return this._options.formEditor || new FormEditor();
    }

    if (type === 'formLayoutValidator') {
      return this._options.formLayoutValidator || new FormLayoutValidator();
    }

    if (type === 'eventBus') {
      return this._options.eventBus || new EventBus();
    }

    if (type === 'modeling') {
      return this._options.modeling || new Modeling();
    }

    if (type === 'selection') {
      return this._options.selection || new Selection();
    }

    if (type === 'templating') {
      return this._options.templating || new Templating();
    }

    if (type === 'debounce') {
      return fn => fn;
    }

    if (type === 'formFieldRegistry') {
      return this._options.formFieldRegistry || new FormFieldRegistry();
    }
  }
}

export class FormLayoutValidator {
  validateField() {}
}
export class Templating {

  constructor(options = {}) {
    this.isTemplate = options.isTemplate || (() => false);
    this.evaluate = options.evaluate || ((value) => `Evaluation of "${value}"`);
  }
}

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
      } else if (type === 'formEditor') {
        return new FormEditor();
      } else if (type === 'formLayoutValidator') {
        return {
          validateField() {}
        };
      } else if (type === 'expressionLanguage') {
        return {
          isExpression: () => false
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