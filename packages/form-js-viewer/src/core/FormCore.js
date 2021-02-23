import mitt from 'mitt';

import { createRoot, createState, createEffect, batch } from 'solid-js';

import FieldRegistry from './FieldRegistry';

import { Validator } from './validation';

import {
  pathStringify,
  findData
} from '../util';


/**
 * @typedef { any } Schema
 * @typedef { { [x: string]: any } } Data
 * @typedef { { [x: string]: string[] } } Errors
 * @typedef { { [x: string]: any } } Properties
 *
 * @typedef { { data: Data, schema: Schema, properties?: Properties } } FormCoreOptions
 *
 * @typedef { { data: Data, errors: Errors, schema: Schema, properties: Properties } } State
 */

/**
 * The form core.
 */
export default class FormCore {

  /**
   * @constructor
   * @param { FormCoreOptions } options
   */
  constructor(options) {

    const {
      schema = {},
      data = {},
      properties = {}
    } = options;

    /**
     * @private
     */
    this.emitter = mitt();

    this.validator = new Validator();
    this.fields = new FieldRegistry(this);

    /**
     * @private
     * @type {Schema}
     */
    this.initialSchema = clone(schema);

    /**
     * @private
     * @type {Data}
     */
    this.initialData = clone(data);

    const [ state, setState ] = createRoot((dispose) => {

      const [ state, setState ] = createState({
        data: clone(this.initialData),
        errors: {},
        schema: clone(this.initialSchema),
        properties
      });

      createEffect(() => {
        console.log('FormCore#changed', state);

        this.changed({
          data: state.data,
          errors: state.errors,
          schema: state.schema,
          properties: state.properties
        });
      });

      this.on('dispose', dispose);

      return [ state, setState ];
    });

    /**
     * @type {State}
     */
    this.state = state;

    /**
     * @type { (...args) => void }
     */
    this.setState = setState;
  }

  reset() {
    console.log('FormCore#reset');

    this.emitter.emit('reset');

    const properties = this.state.properties;

    this.setState({
      data: clone(this.initialData),
      schema: clone(this.initialSchema),
      errors: {},
      properties
    });
  }

  submit() {
    console.log('FormCore#submit');

    const data = this.state.data;

    const errors = this.validateAll(data);

    const payload = clone({
      data,
      errors
    });

    this.emitter.emit('submit', payload);

    return payload;
  }

  /**
   * @param  { { dataPath: (string|number)[], value: any } } update
   */
  update(update) {
    const {
      dataPath,
      value
    } = update;

    console.log('FormCore#update', update);

    const id = pathStringify(dataPath);

    const {
      field
    } = this.fields.getById(id) || {};

    const fieldErrors = this.validator.validateField(field, value);

    batch(() => {

      // @ts-ignore-next-line
      this.setState('data', ...dataPath, value);

      this.setState('errors', id, fieldErrors.length ? fieldErrors : undefined);
    });
  }

  /**
   * @param { any } data
   * @return { {[x: string]: string[]} } errors
   */
  validateAll(data) {

    batch(() => {
      for (const { id, path, field } of this.fields.getAll()) {

        const value = findData(data, path);

        const fieldErrors = this.validator.validateField(field, value);

        this.setState('errors', id, fieldErrors.length ? fieldErrors : undefined);
      }
    });

    return this.state.errors;
  }

  getState() {
    return clone(this.state);
  }

  changed(state) {
    this.emitter.emit('change', clone(state));
  }

  setProperty(property, value) {
    this.setState('properties', {
      [ property ]: value
    });
  }

  on(event, callback) {
    this.emitter.on(event, callback);
  }

  off(event, callback) {
    this.emitter.off(event, callback);
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}