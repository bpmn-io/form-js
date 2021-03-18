import mitt from 'mitt';

import { set } from 'min-dash';

import { Validator } from './validation';

import {
  findData,
  importSchema,
  pathsEqual
} from '../util';

import { clone } from '../util';


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
    this.fields = new Map();

    const {
      schema: importedSchema
    } = importSchema(schema);

    /**
     * @private
     * @type {Schema}
     */
    this.initialSchema = clone(importedSchema);

    /**
     * @private
     * @type {Data}
     */
    this.initialData = clone(data);

    /**
     * @type {State}
     */
    this.state = {
      data: clone(this.initialData),
      errors: {},
      schema: clone(this.initialSchema),
      properties
    };
  }

  reset() {
    this.emitter.emit('reset');

    this.setState({
      data: clone(this.initialData),
      schema: clone(this.initialSchema),
      errors: {}
    });
  }

  submit() {
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
   * @param  { { path: (string|number)[], value: any } } update
   */
  update(update) {
    const {
      path,
      value
    } = update;

    const field = Array.from(this.fields.values()).find((field) => pathsEqual(field.path, path));

    const fieldErrors = this.validator.validateField(field, value);

    const data = set(this.getState().data, path, value);

    const errors = set(this.getState().errors, path, fieldErrors.length ? fieldErrors : undefined);

    this.setState({
      data,
      errors
    });
  }

  /**
   * @param { any } data
   * @return { {[x: string]: string[]} } errors
   */
  validateAll(data) {
    const errors = Array.from(this.fields.values()).reduce((errors, field) => {
      const { path } = field;

      const value = findData(data, path);

      const fieldErrors = this.validator.validateField(field, value);

      return set(errors, path, fieldErrors.length ? fieldErrors : undefined);
    }, {});

    this.setState({ errors });

    return this.getState().errors;
  }

  getState() {
    return clone(this.state);
  }

  setState(state) {
    this.state = {
      ...this.state,
      ...state
    };

    this.changed(this.state);
  }

  changed(state) {
    this.emitter.emit('changed', clone(state));
  }

  setProperty(property, value) {
    const properties = set(this.getState().properties, [ property ], value);

    this.setState({ properties });
  }

  on(event, callback) {
    this.emitter.on(event, callback);
  }

  off(event, callback) {
    this.emitter.off(event, callback);
  }
}