import {
  isString,
  set
} from 'min-dash';

import {
  createInjector,
  createFormContainer
} from './util';

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

    /**
     * @private
     * @type {Element}
     */
    this._container = createFormContainer();

    const {
      container,
      injector = this._createInjector(options, this._container),
      properties = {}
    } = options;

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

    this.get = injector.get;

    this.invoke = injector.invoke;

    this.get('eventBus').fire('form.init');

    if (container) {
      this.attachTo(container);
    }
  }

  /**
   * @param {Schema} schema
   * @param {Data} [data]
   */
  importSchema(schema, data = {}) {
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
   * @param {Element} container
   *
   * @returns {import('didi').Injector}
   */
  _createInjector(options, container) {
    const {
      additionalModules = [],
      modules = []
    } = options;

    const config = {
      renderer: {
        container
      }
    };

    return createInjector([
      { config: [ 'value', config ] },
      { form: [ 'value', this ] },
      core,
      ...modules,
      ...additionalModules
    ]);
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