import {
  get,
  isString,
  set
} from 'min-dash';

import {
  clone,
  createInjector,
  createFormContainer,
  pathStringify
} from './util';

import core from './core';

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
  constructor(options = {}) {

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
    this._importedData = null;

    this.get = injector.get;

    this.invoke = injector.invoke;

    this.get('eventBus').fire('form.init');

    if (container) {
      this.attachTo(container);
    }
  }

  clear() {

    // Clear form services
    this._emit('diagram.clear');

    // Clear diagram services (e.g. EventBus)
    this._emit('form.clear');

    this.get('formFieldRegistry').clear();
  }

  destroy() {

    // Destroy form services
    this.get('eventBus').fire('form.destroy');

    // Destroy diagram services (e.g. EventBus)
    this.get('eventBus').fire('diagram.destroy');

    this._detach(false);
  }

  /**
   * @param {Schema} schema
   * @param {Data} [data]
   */
  importSchema(schema, data = {}) {
    return new Promise((resolve, reject) => {
      this.clear();

      this._importedData = null;

      const importer = this.get('importer');

      schema = clone(schema);
      data = clone(data);

      importer.importSchema(schema, data)
        .then(({ warnings }) => {
          this._importedData = clone(data);

          this._setState({
            data,
            errors: {},
            schema
          });

          this._emit('import.done', { warnings });

          resolve({ warnings });
        })
        .catch(err => {
          this._emit('import.done', { error: err, warnings: err.warnings });

          reject(err);
        });
    });
  }

  /**
   * @returns { { data: Data, errors: Errors } }
   */
  submit() {

    const {
      properties
    } = this._getState();

    if (properties.readOnly) {
      throw new Error('form is read-only');
    }

    const formFieldRegistry = this.get('formFieldRegistry');

    // do not submit disabled form fields
    const data = Array.from(formFieldRegistry.values()).reduce((data, field) => {
      const {
        disabled,
        _path
      } = field;

      if (disabled) {

        // strip disabled field value
        set(data, _path, undefined);
      }

      return data;
    }, clone(this._getState().data));

    const errors = this.validate();

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
      data: clone(this._importedData),
      errors: {}
    });
  }

  /**
   * @returns {Errors}
   */
  validate() {
    const formFieldRegistry = this.get('formFieldRegistry'),
          validator = this.get('validator');

    const { data } = this._getState();

    const errors = Array.from(formFieldRegistry.values()).reduce((errors, field) => {
      const {
        disabled,
        _path
      } = field;

      if (disabled) {
        return errors;
      }

      const value = get(data, _path);

      const fieldErrors = validator.validateField(field, value);

      return set(errors, [ pathStringify(_path) ], fieldErrors.length ? fieldErrors : undefined);
    }, /** @type {Errors} */ ({}));

    this._setState({ errors });

    return errors;
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
    this._detach();
  }

  /**
   * @private
   *
   * @param {boolean} [emit]
   */
  _detach(emit = true) {
    const container = this._container,
          parentNode = container.parentNode;

    if (!parentNode) {
      return;
    }

    if (emit) {
      this._emit('detach');
    }

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
   * @param {number} priority
   * @param {Function} handler
   */
  on(type, priority, handler) {
    this.get('eventBus').on(type, priority, handler);
  }

  /**
   * @param {FormEvent} type
   * @param {Function} handler
   */
  off(type, handler) {
    this.get('eventBus').off(type, handler);
  }

  /**
   * @private
   *
   * @param {FormOptions} options
   * @param {Element} container
   *
   * @returns {Injector}
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

  /**
   * @private
   */
  _emit(type, data) {
    this.get('eventBus').fire(type, data);
  }

  /**
   * @internal
   *
   * @param { { add?: boolean, field: any, remove?: number, value?: any } } update
   */
  _update(update) {
    const {
      field,
      value
    } = update;

    const { _path } = field;

    let {
      data,
      errors
    } = this._getState();

    const validator = this.get('validator');

    const fieldErrors = validator.validateField(field, value);

    set(data, _path, value);

    set(errors, [ pathStringify(_path) ], fieldErrors.length ? fieldErrors : undefined);

    this._setState({
      data: clone(data),
      errors: clone(errors)
    });
  }

  /**
   * @internal
   */
  _getState() {
    return this._state;
  }

  /**
   * @internal
   */
  _setState(state) {
    this._state = {
      ...this._state,
      ...state
    };

    this._emit('changed', this._getState());
  }

}