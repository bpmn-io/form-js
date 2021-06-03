import { Injector } from 'didi';

import {
  isString,
  set
} from 'min-dash';

import core from './core';

import {
  clone,
  findData,
  importSchema,
  pathsEqual
} from './util';

/**
 * @typedef { import('didi').Injector } Injector
 *
 * @typedef { { [x: string]: any } } Data
 * @typedef { { [x: string]: string[] } } Errors
 * @typedef { any[] } Modules
 * @typedef { ('readOnly' | string) } FormProperty
 * @typedef { ('submit' | 'changed' | string) } FormEvent
 * @typedef { { [x: string]: any } } FormProperties
 * @typedef { any } Schema
 *
 * @typedef { {
 *   additionalModules?: Modules,
 *   container?: Element|string,
 *   injector?: Injector,
 *   modules?: Modules,
 *   properties?: FormProperties
 * } } FormOptions
 *
 * @typedef { {
 *   data: Data,
 *   errors: Errors,
 *   properties: FormProperties,
 *   schema: Schema
 * } } State
 */


export default class Form {

  /**
   * @constructor
   * @param {FormOptions} options
   */
  constructor(options) {
    let {
      container,
      injector,
      properties = {}
    } = options;

    /**
     * @private
     * @type {Element}
     */
    this._container = createContainer();

    /**
     * @private
     * @type {State}
     */
    this._state = {
      data: null,
      properties,
      errors: {},
      schema: null
    };

    /**
     * @private
     * @type {Data}
     */
    this.importedData = null;

    if (!injector) {
      const modules = this._init(options);

      injector = bootstrap(modules);
    }

    this.get = injector.get;

    this.invoke = injector.invoke;

    const eventBus = this.get('eventBus');

    eventBus.fire('form.init');

    if (container) {
      this.attachTo(container);
    }
  }

  /**
   * @param {Schema} schema
   * @param {Data} [data]
   */
  import(schema, data = {}) {
    this.importedData = clone(data);

    this._setState({
      data: clone(data),
      errors: {},
      schema: importSchema(schema).schema
    });
  }

  /**
   * @returns { { data: Data, errors: Errors } }
   */
  submit() {
    this.validate();

    const {
      data,
      errors
    } = this._getState();

    this._emit('submit', {
      data,
      errors
    });

    return {
      data,
      errors
    };
  }

  reset() {
    this._emit('reset');

    this._setState({
      data: clone(this.importedData),
      errors: {}
    });
  }

  /**
   * @returns { { [x: string]: string[] } }
   */
  validate() {
    const formFieldRegistry = this.get('formFieldRegistry'),
          validator = this.get('validator');

    const { data } = this._getState();

    const errors = Array.from(formFieldRegistry.values()).reduce((errors, field) => {
      const { path } = field;

      const value = findData(data, path);

      const fieldErrors = validator.validateField(field, value);

      return set(errors, path, fieldErrors.length ? fieldErrors : undefined);
    }, {});

    this._setState({ errors });

    return this._getState().errors;
  }

  /**
   * @param {Element|string} parentNode
   */
  attachTo(parentNode) {
    if (!parentNode) {
      throw new Error('parentNode required');
    }

    this.detach();

    if (isString(parentNode)) {
      parentNode = document.querySelector(parentNode);
    }

    const container = this._container;

    parentNode.appendChild(container);

    this._emit('attach');
  }

  detach() {
    const container = this._container,
          parentNode = container.parentNode;

    if (!parentNode) {
      return;
    }

    this._emit('detach');

    parentNode.removeChild(container);
  }

  /**
   * @param {FormProperty} property
   * @param {any} value
   */
  setProperty(property, value) {
    const properties = set(this._getState().properties, [ property ], value);

    this._setState({ properties });
  }

  /**
   * @param {FormEvent} type
   * @param {Function} handler
   */
  on(type, handler) {
    this.get('eventBus').on(type, handler);
  }

  /**
   * @param {FormEvent} type
   * @param {Function} handler
   */
  off(type, handler) {
    this.get('eventBus').on(type, handler);
  }

  /**
   * @param {FormOptions} options
   *
   * @returns {Modules}
   */
  _init(options) {
    const {
      additionalModules = [],
      modules = []
    } = options;

    const config = {
      renderer: {
        container: this._container
      }
    };

    return [
      { config: [ 'value', config ] },
      { form: [ 'value', this ] },
      core,
      ...modules,
      ...additionalModules
    ];
  }

  _emit(type, data) {
    this.get('eventBus').fire(type, data);
  }

  /**
   * @param { { path: (string|number)[], value: any } } update
   */
  _update(update) {
    const {
      path,
      value
    } = update;

    const formFieldRegistry = this.get('formFieldRegistry'),
          validator = this.get('validator');

    const field = Array.from(formFieldRegistry.values()).find((field) => pathsEqual(field.path, path));

    const fieldErrors = validator.validateField(field, value);

    const data = set(this._getState().data, path, value);

    const errors = set(this._getState().errors, path, fieldErrors.length ? fieldErrors : undefined);

    this._setState({
      data,
      errors
    });
  }

  _getState() {
    return clone(this._state);
  }

  _setState(state) {
    this._state = {
      ...this._state,
      ...state
    };

    this._emit('changed', this._getState());
  }

}


// helpers /////////////

export function bootstrap(bootstrapModules) {
  const modules = [],
        components = [];

  function hasModule(module) {
    return modules.includes(module);
  }

  function addModule(module) {
    modules.push(module);
  }

  function visit(module) {
    if (hasModule(module)) {
      return;
    }

    (module.__depends__ || []).forEach(visit);

    if (hasModule(module)) {
      return;
    }

    addModule(module);

    (module.__init__ || []).forEach(function(component) {
      components.push(component);
    });
  }

  bootstrapModules.forEach(visit);

  const injector = new Injector(modules);

  components.forEach(function(component) {
    try {
      injector[ typeof component === 'string' ? 'get' : 'invoke' ](component);
    } catch (err) {
      console.error('Failed to instantiate component');
      console.error(err.stack);

      throw err;
    }
  });

  return injector;
}

/**
 * @param {string?} prefix
 *
 * @returns Element
 */
export function createContainer(prefix = 'fjs') {
  const container = document.createElement('div');

  container.classList.add(`${ prefix }-container`);

  return container;
}