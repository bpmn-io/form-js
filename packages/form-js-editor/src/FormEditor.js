import { clone, createFormContainer, createInjector, schemaVersion } from '@bpmn-io/form-js-viewer';
import Ids from 'ids';
import { isString, set } from 'min-dash';

import core from './core';

import EditorActionsModule from './features/editor-actions';
import DraggingModule from './features/dragging';
import KeyboardModule from './features/keyboard';
import ModelingModule from './features/modeling';
import SelectionModule from './features/selection';
import PaletteModule from './features/palette';
import PropertiesPanelModule from './features/properties-panel';
import RenderInjectionModule from './features/render-injection';
import ExpressionLanguageModule from './features/expression-language';

import { MarkdownModule } from '@bpmn-io/form-js-viewer';

const ids = new Ids([ 32, 36, 1 ]);

/**
 * @typedef { import('./types').Injector } Injector
 * @typedef { import('./types').Module } Module
 * @typedef { import('./types').Schema } Schema
 *
 * @typedef { import('./types').FormEditorOptions } FormEditorOptions
 * @typedef { import('./types').FormEditorProperties } FormEditorProperties
 *
 * @typedef { {
 *   properties: FormEditorProperties,
 *   schema: Schema
 * } } State
 *
 * @typedef { (type:string, priority:number, handler:Function) => void } OnEventWithPriority
 * @typedef { (type:string, handler:Function) => void } OnEventWithOutPriority
 * @typedef { OnEventWithPriority & OnEventWithOutPriority } OnEventType
 */

/**
 * The form editor.
 */
export default class FormEditor {

  /**
   * @constructor
   * @param {FormEditorOptions} options
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

    this._container.setAttribute('input-handle-modified-keys', 'z,y');

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

    // clear form services
    this._emit('diagram.clear');

    // clear diagram services (e.g. EventBus)
    this._emit('form.clear');
  }

  destroy() {

    // destroy form services
    this.get('eventBus').fire('form.destroy');

    // destroy diagram services (e.g. EventBus)
    this.get('eventBus').fire('diagram.destroy');

    this._detach(false);
  }

  /**
   * @param {Schema} schema
   *
   * @return {Promise<{ warnings: Array<any> }>}
   */
  importSchema(schema) {
    return new Promise((resolve, reject) => {
      try {
        this.clear();

        const {
          schema: importedSchema,
          warnings
        } = this.get('importer').importSchema(schema);

        this._setState({
          schema: importedSchema
        });

        this._emit('import.done', { warnings });

        return resolve({ warnings });
      } catch (error) {
        this._emit('import.done', {
          error: error,
          warnings: error.warnings || []
        });

        return reject(error);
      }
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
   * @internal
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
  off(type, handler) {
    this.get('eventBus').off(type, handler);
  }

  /**
   * @internal
   *
   * @param {FormEditorOptions} options
   * @param {Element} container
   *
   * @returns {Injector}
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

  /**
   * @internal
   */
  _emit(type, data) {
    this.get('eventBus').fire(type, data);
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
      ModelingModule,
      EditorActionsModule,
      DraggingModule,
      KeyboardModule,
      SelectionModule,
      PaletteModule,
      ExpressionLanguageModule,
      MarkdownModule,
      PropertiesPanelModule,
      RenderInjectionModule
    ];
  }

  /**
   * @internal
   */
  _onEvent(type, priority, handler) {
    this.get('eventBus').on(type, priority, handler);
  }

}

// helpers //////////

export function exportSchema(schema, exporter, schemaVersion) {

  const exportDetails = exporter ? {
    exporter
  } : {};

  const cleanedSchema = clone(schema, (name, value) => {
    if ([ '_parent', '_path' ].includes(name)) {
      return undefined;
    }

    return value;
  });

  return {
    ...cleanedSchema,
    ...exportDetails,
    schemaVersion
  };
}