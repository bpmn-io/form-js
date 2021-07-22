import {
  isString,
  set
} from 'min-dash';

import {
  createInjector,
  clone,
  createFormContainer,
  schemaVersion
} from '@bpmn-io/form-js-viewer';

import core from './core';

import EditorActionsModule from './features/editor-actions';
import KeyboardModule from './features/keyboard';

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
  constructor(options = {}) {

    /**
     * @private
     * @type {Element}
     */
    this._container = createFormContainer();

    const {
      container,
      exporter,
      injector = this._createInjector(options, this._container),
      properties = {}
    } = options;

    /**
     * @private
     * @type {any}
     */
    this.exporter = exporter;

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

  clear() {

    // Clear form services
    this._emit('diagram.clear');

    // Clear diagram services (e.g. EventBus)
    this._emit('form.clear');
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
   */
  importSchema(schema) {
    return new Promise((resolve, reject) => {
      this.clear();

      const importer = this.get('importer');

      schema = clone(schema);

      importer.importSchema(schema)
        .then(({ warnings }) => {
          this._setState({
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
      schemaVersion
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
    this._detach();
  }

  /**
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
   * @param {any} property
   * @param {any} value
   */
  setProperty(property, value) {
    const properties = set(this._getState().properties, [ property ], value);

    this._setState({ properties });
  }

  /**
   * @param {string} type
   * @param {number} priority
   * @param {Function} handler
   */
  on(type, priority, handler) {
    this.get('eventBus').on(type, priority, handler);
  }

  /**
   * @param {string} type
   * @param {Function} handler
   */
  off(type, handler) {
    this.get('eventBus').off(type, handler);
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
      modules = this._getModules(),
      renderer = {}
    } = options;

    const config = {
      ...options,
      renderer: {
        ...renderer,
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
    return this._state;
  }

  _setState(state) {
    this._state = {
      ...this._state,
      ...state
    };

    this._emit('changed', this._getState());
  }

  _getModules() {
    return [
      EditorActionsModule,
      KeyboardModule
    ];
  }

}

// helpers //////////

export function exportSchema(schema, exporter, schemaVersion) {

  const exportDetails = exporter ? {
    exporter
  } : {};

  const cleanedSchema = clone(schema, (name, value) => {
    if ([ '_id', '_parent', '_path' ].includes(name)) {
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