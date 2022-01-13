import {
  get,
  isUndefined
} from 'min-dash';

import {
  clone,
  generateIdForType
} from '../util';


export default class Importer {

  /**
   * @constructor
   * @param { import('../core').FormFieldRegistry } formFieldRegistry
   * @param { import('../render/FormFields').default } formFields
   */
  constructor(formFieldRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
  }

  /**
   * Import schema adding `id`, `_parent` and `_path`
   * information to each field and adding it to the
   * form field registry.
   *
   * @param {any} schema
   * @param {any} [data]
   *
   * @return { { warnings: Array<any>, schema: any, data: any } }
   */
  importSchema(schema, data = {}) {

    // TODO: Add warnings
    const warnings = [];

    try {
      const importedSchema = this.importFormField(clone(schema)),
            importedData = this.importData(clone(data));

      return {
        warnings,
        schema: importedSchema,
        data: importedData
      };
    } catch (err) {
      err.warnings = warnings;

      throw err;
    }
  }

  /**
   * @param {any} formField
   * @param {string} [parentId]
   *
   * @return {any} importedField
   */
  importFormField(formField, parentId) {
    const {
      components,
      key,
      type,
      id = generateIdForType(type)
    } = formField;

    if (parentId) {

      // set form field parent
      formField._parent = parentId;
    }

    if (!this._formFields.get(type)) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    if (key) {

      // validate <key> uniqueness
      if (this._formFieldRegistry._keys.assigned(key)) {
        throw new Error(`form field with key <${ key }> already exists`);
      }

      this._formFieldRegistry._keys.claim(key, formField);

      // TODO: buttons should not have key
      if (type !== 'button') {

        // set form field path
        formField._path = [ key ];
      }
    }

    if (id) {

      // validate <id> uniqueness
      if (this._formFieldRegistry._ids.assigned(id)) {
        throw new Error(`form field with id <${ id }> already exists`);
      }

      this._formFieldRegistry._ids.claim(id, formField);
    }

    // set form field ID
    formField.id = id;

    this._formFieldRegistry.add(formField);

    if (components) {
      this.importFormFields(components, id);
    }

    return formField;
  }

  importFormFields(components, parentId) {
    components.forEach((component) => {
      this.importFormField(component, parentId);
    });
  }

  /**
   * @param {Object} data
   *
   * @return {Object} importedData
   */
  importData(data) {
    return this._formFieldRegistry.getAll().reduce((importedData, formField) => {
      const {
        defaultValue,
        _path,
        type
      } = formField;

      if (!_path) {
        return importedData;
      }

      // (1) try to get value from data
      // (2) try to get default value from form field
      // (3) get empty value from form field
      return {
        ...importedData,
        [ _path[ 0 ] ]: get(data, _path, isUndefined(defaultValue) ? this._formFields.get(type).emptyValue : defaultValue)
      };
    }, {});
  }
}

Importer.$inject = [ 'formFieldRegistry', 'formFields' ];