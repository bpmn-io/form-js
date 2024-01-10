import { clone } from '../util';

export class Importer {

  /**
   * @constructor
   * @param { import('./FormFieldRegistry').FormFieldRegistry } formFieldRegistry
   * @param { import('./PathRegistry').PathRegistry } pathRegistry
   * @param { import('./FieldFactory').FieldFactory } fieldFactory
   * @param { import('./FormLayouter').FormLayouter } formLayouter
   */
  constructor(formFieldRegistry, pathRegistry, fieldFactory, formLayouter) {
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._fieldFactory = fieldFactory;
    this._formLayouter = formLayouter;
  }

  /**
   * Import schema creating rows, fields, attaching additional
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
      this._cleanup();
      const importedSchema = this.importFormField(clone(schema));
      this._formLayouter.calculateLayout(clone(importedSchema));

      return {
        schema: importedSchema,
        warnings
      };
    } catch (err) {
      this._cleanup();
      err.warnings = warnings;
      throw err;
    }
  }

  _cleanup() {
    this._formLayouter.clear();
    this._formFieldRegistry.clear();
    this._pathRegistry.clear();
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
      components
    } = fieldAttrs;

    let parent, path;

    if (parentId) {
      parent = this._formFieldRegistry.get(parentId);
    }

    // set form field path
    path = parent ? [ ...parent._path, 'components', index ] : [];

    const field = this._fieldFactory.create({
      ...fieldAttrs,
      _path: path,
      _parent: parentId
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

Importer.$inject = [ 'formFieldRegistry', 'pathRegistry', 'fieldFactory', 'formLayouter' ];