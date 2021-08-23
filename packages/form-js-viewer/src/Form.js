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
 * @typedef { import('./types').Injector } Injector
 * @typedef { import('./types').Data } Data
 * @typedef { import('./types').Errors } Errors
 * @typedef { import('./types').Schema } Schema
 * @typedef { import('./types').FormProperties } FormProperties
 * @typedef { import('./types').FormProperty } FormProperty
 * @typedef { import('./types').FormEvent } FormEvent
 * @typedef { import('./types').FormOptions } FormOptions
 *
 * @typedef { {
 *   data: Data,
 *   initialData: Data,
 *   errors: Errors,
 *   properties: FormProperties,
 *   schema: Schema
 * } } State
 */


/**
 * The form.
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
      initialData: null,
      data: null,
      properties,
      errors: {},
      schema: null
    };

    this.get = injector.get;

    this.invoke = injector.invoke;

    this.get('eventBus').fire('form.init');

    if (container) {
      this.attachTo(container);
    }
  }

  clear() {

    // clear form services
    this._emit('diagram.clear');

    // clear diagram services (e.g. EventBus)
    this._emit('form.clear');
  }

  /**
   * Destroy the form, removing it from DOM,
   * if attached.
   */
  destroy() {

    // destroy form services
    this.get('eventBus').fire('form.destroy');

    // destroy diagram services (e.g. EventBus)
    this.get('eventBus').fire('diagram.destroy');

    this._detach(false);
  }

  /**
   * Open a form schema with the given initial data.
   *
   * @param {Schema|string} schema
   * @param {Data} [data]
   *
   * @return Promise<{ warnings: Array<any> }>
   */
  importSchema(schema, data = {}) {
    return new Promise((resolve, reject) => {
      try {
        this.clear();

        const {
          schema: importedSchema,
          data: importedData,
          warnings
        } = this.get('importer').importSchema(schema, data);

        this._setState({
          data: importedData,
          errors: {},
          schema: importedSchema,
          initialData: clone(importedData)
        });

        this._emit('import.done', { warnings });

        return resolve({ warnings });
      } catch (error) {
        this._emit('import.done', {
          error,
          warnings: error.warnings || []
        });

        return reject(error);
      }
    });
  }

  /**
   * Submit the form, triggering all field validations.
   *
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
    const data = formFieldRegistry.getAll().reduce((data, field) => {
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
      data: clone(this._state.initialData),
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

    const errors = formFieldRegistry.getAll().reduce((errors, field) => {
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