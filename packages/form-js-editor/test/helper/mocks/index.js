
import { Injector } from 'didi';
import { isUndefined } from 'min-dash';

import { EditorFormFields } from '../../../src/render/EditorFormFields';

const EDITOR_CONFIG = {
  propertiesPanel: {
    debounce: false
  }
};

export function createMockInjector(services = {}, options = {}) {
  const injector = new Injector([ _createEditorMockModule(services, options) ]);
  injector.init();
  return injector;
}

function _createEditorMockModule(services, options) {
  return {
    formEditor: [ 'value', services.formEditor || new FormEditorMock(options) ],
    formLayoutValidator: [ 'value', services.formLayoutValidator || new FormLayoutValidatorMock(options) ],
    eventBus: [ 'value', services.eventBus || new EventBusMock(options) ],
    propertiesPanel: [ 'value', services.propertiesPanel || new PropertiesPanelMock(options) ],
    expressionLanguage: [ 'value', services.expressionLanguage || new ExpressionLanguageMock(options) ],
    modeling: [ 'value', services.modeling || new ModelingMock(options) ],
    selection: [ 'value', services.selection || new SelectionMock(options) ],
    templating: [ 'value', services.templating || new TemplatingMock(options) ],
    formFieldRegistry: [ 'value', services.formFieldRegistry || new FormFieldRegistryMock(options) ],
    pathRegistry: [ 'value', services.pathRegistry || new PathRegistryMock(options) ],
    debounce: [ 'value', services.debounce || (fn => fn) ],
    config: [ 'value', services.config || EDITOR_CONFIG ],

    // using actual implementations in testing
    formFields: services.formFields ? [ 'value', services.formFields ] : [ 'type', EditorFormFields ],
  };
}

export class FormEditorMock {

  constructor(options = {}) {
    this._state = {
      schema: isUndefined(options.schema) ? {} : options.schema,
      properties: options.properties || {}
    };
  }

  getSchema() {
    return this._state.schema;
  }

  _getState() {
    return this._state;
  }
}

export class ModelingMock {
  editFormField() {}
}

export class PropertiesPanelMock {
  registerProvider() {}
}

export class SelectionMock {
  constructor(options = {}) {
    this._selection = options.field;
  }

  get() {
    return this._selection;
  }
}

export class FormFieldRegistryMock {

  constructor() {
    this._ids = {
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

export class PathRegistryMock {

  constructor(options) {
    this._valuePaths = options.valuePaths || {};
    this._claimedPaths = options.claimedPaths || [];
  }

  getValuePath(field) {

    if (this._valuePaths[ field.id ]) {
      return this._valuePaths[ field.id ];
    }

    return [ field.key ];
  }

  canClaimPath(path) {
    return !this._claimedPaths.some(claimedPath => path.join('.') === claimedPath);
  }

  unclaimPath() {}
  claimPath() {}
}

export class EventBusMock {
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

export class ExpressionLanguageMock {
  isExpression() {}
}

export class FormLayoutValidatorMock {
  validateField() {}
}

export class TemplatingMock {
  constructor(options = {}) {

    const {
      isTemplate = () => false,
      evaluate = (value) => `Evaluation of "${value}"`
    } = options;

    this.isTemplate = isTemplate;
    this.evaluate = evaluate;
  }
}
