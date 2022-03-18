import { clone, createFormContainer, createInjector, schemaVersion } from '@bpmn-io/form-js-viewer';
import Ids from 'ids';
import { isString, set } from 'min-dash';

import core from './core';
import EditorActionsModule from './features/editor-actions';
import KeyboardModule from './features/keyboard';
import ModelingModule from './features/modeling';
import SelectionModule from './features/selection';
import { ALL_COMPONENTS } from './render/components/properties-panel/Util';

const ids = new Ids([ 32, 36, 1 ]);

/**
 * @typedef { import('./types').Injector } Injector
 * @typedef { import('./types').Module } Module
 * @typedef { import('./types').Schema } Schema
 * @typedef { import('./types').ComponentTypes} ComponentTypes
 * @typedef { import('./types').ComponentActions} ComponentActions
 * @typedef { import('./types').FormEditorOptions } FormEditorOptions
 * @typedef { import('./types').FormEditorProperties } FormEditorProperties
 *
 *
 *
 *
 * @typedef { {
 *   properties: FormEditorProperties,
 *   availableComponentTypes?: ComponentTypes[],
 *   unavailableComponentAction: ComponentActions,
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

    /**
     * @type {FormEditorOptions}
     */
    const {
      container,
      availableComponentTypes=[],
      unavailableComponentAction,
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
     * Typechecking
     */
    // if (!(Array.isArray(availableComponentTypes) && availableComponentTypes.every((elem => typeof elem === 'string')))) {
    //   throw Error('Form Schema option "availableComponentTypes" is invalid');
    // }
    // if (!(typeof unavailableComponentAction === 'string' && ['allow', 'readonly', 'remove'].includes(unavailableComponentAction))) {
    //   throw Error('Form Schema option "unavailableComponentAction" must be one of "remove","allow", or "readonly"');
    // }

    /**
     * @private
     * @type {State}
     */
    this._state = {
      properties,
      availableComponentTypes,
      unavailableComponentAction,
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

        /**
         * Check that components are allowed and act accordingly
         */
        const { unavailableComponentAction: action, availableComponentTypes } = this._state;
        const { components: schemaComponents } = importedSchema;
        const availableTypes = availableComponentTypes.length !== 0 ? availableComponentTypes : ALL_COMPONENTS;

        const components = schemaComponents.reduce((comps, comp) => {

          if (!availableTypes.includes(comp.type)) {
            if (action === 'remove' || !ALL_COMPONENTS.includes(comp.type)) {
              if (!ALL_COMPONENTS.includes(comp.type)) warnings.push(`component of type '${comp.type}' is not supported and was removed from imported schema`);
              return comps;
            }

            if (action === 'readonly') {
              warnings.push(`component of type '${comp.type}' is not allowed and was marked readonly in imported schema`);
              return [ ...comps,{ ...comp, readonly: true } ];
            }
            if (action === 'allow') {
              warnings.push(`component of type '${comp.type}' is not of an allowed type, it has been retained in imported schema but additional components of this type can not be added to form`);
              return [ ...comps, { ...comp, unallowed: true } ];
            }
          }
          return [ ...comps, comp ];
        }, []);

        this._setState({
          schema: { ...importedSchema, components }
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
      KeyboardModule,
      SelectionModule
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