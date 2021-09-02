import { clone } from '@bpmn-io/form-js-viewer';


export default class Importer {

  /**
   * @constructor
   * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
   * @param { import('../core/FieldFactory').default } fieldFactory
   */
  constructor(formFieldRegistry, fieldFactory) {
    this._formFieldRegistry = formFieldRegistry;
    this._fieldFactory = fieldFactory;
  }

  /**
   * Import schema creating fields, attaching additional
   * information to each field and adding fields to the
   * field registry.
   *
   * Additional information attached:
   *
   *   * `id` (unless present)
   *   * `_parent`
   *   * `_path`
   *
   * @param {any} schema
   *
   * @typedef {{ warnings: Error[], schema: any }} ImportResult
   * @returns {ImportResult}
   */
  importSchema(schema) {

    // TODO: Add warnings
    const warnings = [];

    try {
      const importedSchema = this.importFormField(clone(schema));

      return {
        schema: importedSchema,
        warnings
      };
    } catch (err) {
      err.warnings = warnings;

      throw err;
    }
  }

  /**
   * @param {{[x: string]: any}} fieldAttrs
   * @param {String} [parentId]
   * @param {number} [index]
   *
   * @return {any} field
   */
  importFormField(fieldAttrs, parentId, index) {
    const {
      components,
      id,
      key
    } = fieldAttrs;

    let parent, path;

    if (parentId) {
      parent = this._formFieldRegistry.get(parentId);
    }

    // validate <id> uniqueness
    if (id && this._formFieldRegistry._ids.assigned(id)) {
      throw new Error(`form field with id <${ id }> already exists`);
    }

    // validate <key> uniqueness
    if (key && this._formFieldRegistry._keys.assigned(key)) {
      throw new Error(`form field with key <${ key }> already exists`);
    }

    // set form field path
    path = parent ? [ ...parent._path, 'components', index ] : [];

    const field = this._fieldFactory.create({
      ...fieldAttrs,
      _path: path,
      _parent: parent && parent.id
    }, false);

    this._formFieldRegistry.add(field);

    if (components) {
      field.components = this.importFormFields(components, field.id);
    }

    return field;
  }

  /**
   * @param {Array<any>} components
   * @param {string} parentId
   *
   * @return {Array<any>} imported components
   */
  importFormFields(components, parentId) {
    return components.map((component, index) => {
      return this.importFormField(component, parentId, index);
    });
  }

}

Importer.$inject = [ 'formFieldRegistry', 'fieldFactory' ];