import Ids from 'ids';
import { get, isObject, isString, isUndefined, set } from 'min-dash';

import {
  ExpressionLanguageModule,
  MarkdownRendererModule,
  ViewerCommandsModule,
  RepeatRenderModule
} from './features';

import { CoreModule } from './core';

import { clone, createFormContainer, createInjector } from './util';

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
 *
 * @typedef { (type:FormEvent, priority:number, handler:Function) => void } OnEventWithPriority
 * @typedef { (type:FormEvent, handler:Function) => void } OnEventWithOutPriority
 * @typedef { OnEventWithPriority & OnEventWithOutPriority } OnEventType
 */

const ids = new Ids([ 32, 36, 1 ]);

/**
 * The form.
 */
export class Form {

  /**
   * @constructor
   * @param {FormOptions} options
   */
  constructor(options = {}) {

    /**
     * @public
     * @type {OnEventType}
     */
    this.on = this._onEvent;

    /**
     * @public
     * @type {String}
     */
    this._id = ids.next();

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

    // clear diagram services (e.g. EventBus)
    this._emit('diagram.clear');

    // clear form services
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
   * @param {Schema} schema
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
          warnings
        } = this.get('importer').importSchema(schema);

        const initializedData = this._getInitializedFieldData(clone(data));

        this._setState({
          data: initializedData,
          errors: {},
          schema: importedSchema,
          initialData: clone(initializedData)
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

    if (properties.readOnly || properties.disabled) {
      throw new Error('form is read-only');
    }

    this._emit('presubmit');

    const data = this._getSubmitData();

    const errors = this.validate();

    const result = {
      data,
      errors
    };

    this._emit('submit', result);

    return result;
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
    const formFields = this.get('formFields'),
          formFieldRegistry = this.get('formFieldRegistry'),
          pathRegistry = this.get('pathRegistry'),
          validator = this.get('validator');

    const { data } = this._getState();

    const getErrorPath = (field, indexes) => [ field.id, ...Object.values(indexes || {}) ];

    function validateFieldRecursively(errors, field, indexes) {
      const { disabled, type, isRepeating } = field;
      const { config: fieldConfig } = formFields.get(type);

      // (1) Skip disabled fields
      if (disabled) {
        return;
      }

      // (2) Validate the field
      const valuePath = pathRegistry.getValuePath(field, { indexes });
      const valueData = get(data, valuePath);
      const fieldErrors = validator.validateField(field, valueData);

      if (fieldErrors.length) {
        set(errors, getErrorPath(field, indexes), fieldErrors);
      }

      // (3) Process parents
      if (!Array.isArray(field.components)) {
        return;
      }

      // (4a) Recurse repeatable parents both across the indexes of repetition and the children
      if (fieldConfig.repeatable && isRepeating) {

        if (!Array.isArray(valueData)) {
          return;
        }

        valueData.forEach((_, index) => {
          field.components.forEach((component) => {
            validateFieldRecursively(errors, component, { ...indexes, [field.id]: index });
          });
        });

        return;
      }

      // (4b) Recurse non-repeatable parents only across the children
      field.components.forEach((component) => validateFieldRecursively(errors, component, indexes));
    }

    const workingErrors = {};
    validateFieldRecursively(workingErrors, formFieldRegistry.getForm());
    const filteredErrors = this._applyConditions(workingErrors, data, { getFilterPath: getErrorPath, leafNodeDeletionOnly: true });
    this._setState({ errors: filteredErrors });

    return filteredErrors;
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
      modules = this._getModules(),
      additionalModules = [],
      ...config
    } = options;

    const enrichedConfig = {
      ...config,
      renderer: {
        container
      }
    };

    return createInjector([
      { config: [ 'value', enrichedConfig ] },
      { form: [ 'value', this ] },
      CoreModule,
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
   * @param { { add?: boolean, field: any, indexes: object, remove?: number, value?: any } } update
   */
  _update(update) {
    const {
      field,
      indexes,
      value
    } = update;

    const {
      data,
      errors
    } = this._getState();

    const validator = this.get('validator'),
          pathRegistry = this.get('pathRegistry');

    const fieldErrors = validator.validateField(field, value);

    const valuePath = pathRegistry.getValuePath(field, { indexes });

    set(data, valuePath, value);

    set(errors, [ field.id, ...Object.values(indexes || {}) ], fieldErrors.length ? fieldErrors : undefined);

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

  /**
 * @internal
 */
  _getModules() {
    return [
      ExpressionLanguageModule,
      MarkdownRendererModule,
      ViewerCommandsModule,
      RepeatRenderModule
    ];
  }

  /**
   * @internal
   */
  _onEvent(type, priority, handler) {
    this.get('eventBus').on(type, priority, handler);
  }

  /**
   * @internal
   */
  _getSubmitData() {
    const formFieldRegistry = this.get('formFieldRegistry');
    const formFields = this.get('formFields');
    const pathRegistry = this.get('pathRegistry');
    const formData = this._getState().data;

    function collectSubmitDataRecursively(submitData, formField, indexes) {
      const { disabled, type } = formField;
      const { config: fieldConfig } = formFields.get(type);

      // (1) Process keyed fields
      if (!disabled && fieldConfig.keyed) {
        const valuePath = pathRegistry.getValuePath(formField, { indexes });
        const value = get(formData, valuePath);
        set(submitData, valuePath, value);
      }

      // (2) Process parents
      if (!Array.isArray(formField.components)) {
        return;
      }

      // (3a) Recurse repeatable parents both across the indexes of repetition and the children
      if (fieldConfig.repeatable && formField.isRepeating) {

        const valueData = get(formData, pathRegistry.getValuePath(formField, { indexes }));

        if (!Array.isArray(valueData)) {
          return;
        }

        valueData.forEach((_, index) => {
          formField.components.forEach((component) => {
            collectSubmitDataRecursively(submitData, component, { ...indexes, [formField.id]: index });
          });
        });

        return;
      }

      // (3b) Recurse non-repeatable parents only across the children
      formField.components.forEach((component) => collectSubmitDataRecursively(submitData, component, indexes));
    }

    const workingSubmitData = {};
    collectSubmitDataRecursively(workingSubmitData, formFieldRegistry.getForm(), {});
    return this._applyConditions(workingSubmitData, formData);
  }

  /**
   * @internal
   */
  _applyConditions(toFilter, data, options = {}) {
    const conditionChecker = this.get('conditionChecker');
    return conditionChecker.applyConditions(toFilter, data, options);
  }

  /**
   * @internal
   */
  _getInitializedFieldData(data, options = {}) {
    const formFieldRegistry = this.get('formFieldRegistry');
    const formFields = this.get('formFields');
    const pathRegistry = this.get('pathRegistry');

    function initializeFieldDataRecursively(initializedData, formField, indexes) {
      const { defaultValue, type, isRepeating } = formField;
      const { config: fieldConfig } = formFields.get(type);

      const valuePath = pathRegistry.getValuePath(formField, { indexes });
      let valueData = get(data, valuePath);

      // (1) Process keyed fields
      if (fieldConfig.keyed) {

        // (a) Retrieve and sanitize data from input
        if (!isUndefined(valueData) && fieldConfig.sanitizeValue) {
          valueData = fieldConfig.sanitizeValue({ formField, data, value: valueData });
        }

        // (b) Initialize field value in output data
        const initializedFieldValue = !isUndefined(valueData) ? valueData : (!isUndefined(defaultValue) ? defaultValue : fieldConfig.emptyValue);
        set(initializedData, valuePath, initializedFieldValue);
      }

      // (2) Process parents
      if (!Array.isArray(formField.components)) {
        return;
      }

      if (fieldConfig.repeatable && isRepeating) {

        // (a) Sanitize repeatable parents data if it is not an array
        if (!valueData || !Array.isArray(valueData)) {
          valueData = new Array(isUndefined(formField.defaultRepetitions) ? 1 : formField.defaultRepetitions).fill().map(_ => ({})) || [];
        }

        // (b) Ensure all elements of the array are objects
        valueData = valueData.map((val) => isObject(val) ? val : {});

        // (c) Initialize field value in output data
        set(initializedData, valuePath, valueData);

        // (d) If indexed ahead of time, recurse repeatable simply across the children
        if (!isUndefined(indexes[formField.id])) {
          formField.components.forEach(
            (component) => initializeFieldDataRecursively(initializedData, component, { ...indexes })
          );

          return;
        }

        // (e1) Recurse repeatable parents both across the indexes of repetition and the children
        valueData.forEach((_, index) => {
          formField.components.forEach(
            (component) => initializeFieldDataRecursively(initializedData, component, { ...indexes, [formField.id]: index })
          );
        });

        return;
      }

      // (e2) Recurse non-repeatable parents only across the children
      formField.components.forEach((component) => initializeFieldDataRecursively(initializedData, component, indexes));
    }

    // allows definition of a specific subfield to generate the data for
    const container = options.container || formFieldRegistry.getForm();
    const indexes = options.indexes || {};
    const basePath = pathRegistry.getValuePath(container, { indexes }) || [];

    // if indexing ahead of time, we must add this index to the data path at the end
    const path = !isUndefined(indexes[container.id]) ? [ ...basePath, indexes[container.id] ] : basePath;

    const workingData = clone(data);
    initializeFieldDataRecursively(workingData, container, indexes);
    return get(workingData, path, {});
  }

}
