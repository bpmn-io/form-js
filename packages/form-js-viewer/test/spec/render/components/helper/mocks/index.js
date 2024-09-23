import { Injector } from 'didi';
import {
  MarkdownRenderer,
  FeelersTemplating,
  FormFields,
  RepeatRenderManager,
  ExpressionLoopPreventer,
} from '../../../../../../src';

export function createMockInjector(services = {}, options = {}) {
  const injector = new Injector([_createMockModule(services, options)]);

  injector.init();

  return injector;
}

const VIEWER_CONFIG = {
  debounce: false,
};

function _createMockModule(services, options) {
  return {
    form: ['value', services.form || new FormMock(options)],
    conditionChecker: ['value', services.conditionChecker || new ConditionCheckerMock(options)],
    expressionLanguage: ['value', services.expressionLanguage || new ExpressionLanguageMock(options)],
    viewerCommands: ['value', services.viewerCommands || new ViewerCommandsMock(options)],
    formLayouter: ['value', services.formLayouter || new FormLayouterMock(options)],
    formFieldRegistry: ['value', services.formFieldRegistry || new FormFieldRegistryMock(options)],
    formFieldInstanceRegistry: [
      'value',
      services.formFieldInstanceRegistry || new FormFieldInstanceRegistryMock(options),
    ],
    pathRegistry: ['value', services.pathRegistry || new PathRegistryMock(options)],
    eventBus: ['value', services.eventBus || new EventBusMock(options)],
    debounce: ['value', services.debounce || ((fn) => fn)],
    config: ['value', services.config || VIEWER_CONFIG],

    // using actual implementations in testing
    formFields: services.formFields ? ['value', services.formFields] : ['type', FormFields],
    templating: services.templating ? ['value', services.templating] : ['type', FeelersTemplating],
    expressionLoopPreventer: services.expressionLoopPreventer
      ? ['value', services.expressionLoopPreventer]
      : ['type', ExpressionLoopPreventer],
    repeatRenderManager: services.repeatRenderManager
      ? ['value', services.repeatRenderManager]
      : ['type', RepeatRenderManager],
    markdownRenderer: services.markdownRenderer ? ['value', services.markdownRenderer] : ['type', MarkdownRenderer],
    fileRegistry: ['value', services.fileRegistry],
  };
}

/**
 *
 * Further potential improvements, if needed:
 *
 * The true ideal here would be to have a hybrid approach where we can both supply options and leverage dependency injection.
 * This could be achieved via having a closure around the classes, which consumes the options and returns the class.
 *
 */

export class FormMock {
  constructor(options) {
    const { data, errors = {}, properties = {}, initialData, newFieldData } = options;

    this.data = data;
    this.errors = errors;
    this.properties = properties;
    this.initialData = initialData;
    this.newFieldData = newFieldData;
  }

  _getState() {
    return {
      data: this.data,
      errors: this.errors,
      properties: this.properties,
      initialData: this.initialData,
    };
  }

  _getInitializedFieldData() {
    return this.newFieldData;
  }
}

export class FormLayouterMock {
  constructor(options) {
    const { children = [] } = options;

    this.children = children;
  }

  getRows() {
    return this.children.map((child) => ({ components: [child.id] }));
  }
}

export class FormFieldRegistryMock {
  constructor(options) {
    const { children = [], field } = options;

    this._fields = [field, ...children];
  }

  get(id) {
    return this._fields.find((field) => field.id === id);
  }
}

export class FormFieldInstanceRegistryMock {
  constructor() {
    this._instances = {};
  }

  syncInstance(instanceId, instance) {
    this._instances[instanceId] = instance;

    return instanceId;
  }

  get(instanceId) {
    return this._instances[instanceId];
  }

  cleanupInstance(instanceId) {
    delete this._instances[instanceId];
  }
}

export class PathRegistryMock {
  getValuePath(field) {
    return field.valuePath || [field.path] || [field.key];
  }
}

export class EventBusMock {
  constructor() {
    this.listeners = {};
  }

  on(event, priority, callback) {
    if (!callback) {
      callback = priority;
    }

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off() {}

  fire(event, context) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(context));
    }
  }
}

export class ConditionCheckerMock {
  applyConditions() {}
  check() {}
}

export class ExpressionLanguageMock {
  isExpression() {}
  evaluate() {}
}

export class ViewerCommandsMock {
  updateFieldValidation() {}
  updateFieldInstanceValidation() {}
}
