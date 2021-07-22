import { clone, generateIdForType } from '../util';


export default class Importer {

  /**
   * @constructor
   * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
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
      const importedData = clone(data);
      const importedSchema = this.importFormField(clone(schema), importedData);

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
   * @param {Object} [data]
   * @param {string} [parentId]
   *
   * @return {any} field
   */
  importFormField(formField, data = {}, parentId) {
    const {
      components,
      key,
      type,
      id = generateIdForType(type)
    } = formField;

    if (parentId) {

      // Set form field parent
      formField._parent = parentId;
    }

    if (!this._formFields.get(type)) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    if (key) {
      this._formFieldRegistry.forEach((formField) => {
        if (formField.key === key) {
          throw new Error(`form field with key <${ key }> already exists`);
        }
      });

      // Set form field path
      formField._path = [ key ];
    }

    // Set form field ID
    formField.id = id;

    this._formFieldRegistry.set(id, formField);

    if (components) {
      this.importFormFields(components, data, id);
    }

    return formField;
  }

  importFormFields(components, data = {}, parentId) {
    components.forEach((component) => {
      this.importFormField(component, data, parentId);
    });
  }
}

Importer.$inject = [ 'formFieldRegistry', 'formFields' ];