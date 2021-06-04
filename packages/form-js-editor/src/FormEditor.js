import {
  isString,
  set
} from 'min-dash';

import {
  createInjector,
  clone,
  createFormContainer,
  importSchema
} from '@bpmn-io/form-js-viewer';

import core from './core';

/**
 * @typedef { import('didi').Injector } Injector
 * @typedef { any[] } Modules
 * @typedef { { [x: string]: any } } FormEditorProperties
 * @typedef { any } Schema
 *
 * @typedef { {
 *   additionalModules?: Modules,
 *   container?: Element|string,
 *   exporter?: any,
 *   injector?: Injector,
 *   modules?: Modules,
 *   properties?: FormEditorProperties,
 *   schemaVersion: number,
 *   [x: string]: any
 * } } FormEditorOptions
 *
 * @typedef { { properties: FormEditorProperties, schema: Schema } } State
 */


export default class FormEditor {

  /**
   * @constructor
   * @param {FormEditorOptions} options
   */
  constructor(options) {

    /**
     * @private
     * @type {Element}
     */
    this._container = createFormContainer();

    const {
      container,
      exporter,
      injector = this._createInjector(options, this._container),
      properties = {},
      schemaVersion
    } = options;

    /**
     * @private
     * @type {any}
     */
    this.exporter = exporter;

    /**
     * @private
     * @type {number}
     */
    this.schemaVersion = schemaVersion;

    /**
     * @private
     * @type {State}
     */
    this._state = {
      properties,
      schema: null
    };

    this.get = injector.get;

    this.invoke = injector.invoke;

    this.get('eventBus').fire('form.init');

    if (container) {
      this.attachTo(container);
    }
  }

  /**
   * @param {Schema} schema
   */
  importSchema(schema) {
    const {
      fields,
      schema: importedSchema
    } = importSchema(schema);

    const formFieldRegistry = this.get('formFieldRegistry');

    formFieldRegistry.clear();

    fields.forEach((value, key) => {
      formFieldRegistry.set(key, value);
    });

    this._setState({
      schema: importedSchema
    });
  }

  /**
   * @returns {Schema}
   */
  saveSchema() {
    return this.getSchema();
  }

  /**
   * @returns {Schema}
   */
  getSchema() {
    const { schema } = this._getState();

    return exportSchema(
      schema,
      this.exporter,
      this.schemaVersion
    );
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
   * @param {any} property
   * @param {any} value
   */
  setProperty(property, value) {
    const properties = set(this._getState().properties, [ property ], value);

    this._setState({ properties });
  }

  /**
   * @param {string} type
   * @param {Function} handler
   */
  on(type, handler) {
    this.get('eventBus').on(type, handler);
  }

  /**
   * @param {string} type
   * @param {Function} handler
   */
  off(type, handler) {
    this.get('eventBus').on(type, handler);
  }

  /**
   * @param {FormEditorOptions} options
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
      { formEditor: [ 'value', this ] },
      core,
      ...modules,
      ...additionalModules
    ]);
  }

  _emit(type, data) {
    this.get('eventBus').fire(type, data);
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

// helpers //////////

export function exportSchema(schema, exporter, schemaVersion) {

  const exportDetails = exporter ? {
    exporter
  } : {};

  const cleanedSchema = clone(schema, (name, value) => {
    if ([ 'id', 'parent', 'path' ].includes(name)) {
      return undefined;
    }

    return value;
  });

  return {
    schemaVersion,
    ...exportDetails,
    ...cleanedSchema
  };
}