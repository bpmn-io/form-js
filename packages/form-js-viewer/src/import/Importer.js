import { generateIdForType } from '../util';

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
   * Import schema adding `id`, `parent` and `path` information to each field and adding it to the form field registry.
   *
   * @param {any} schema
   * @param {any} data
   *
   * @returns {Promise}
   */
  importSchema(schema, data = {}) {
    this._formFieldRegistry.clear();

    // TODO: Add warnings
    const warnings = [];

    return new Promise((resolve, reject) => {
      try {
        this.importFormField(schema, data);
      } catch (err) {
        err.warnings = warnings;

        reject(err);
      }

      resolve({ warnings });
    });
  }

  importFormField(formField, data = {}, parentId) {
    const {
      components,
      key,
      type
    } = formField;

    let parent;

    if (parentId) {

      // Set form field parent
      formField.parent = parentId;

      parent = this._formFieldRegistry.get(parentId);
    }

    if (!this._formFields.get(type)) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    if (key) {

      if (!parent || !parent.isMany) {
        this._formFieldRegistry.forEach((formField) => {
          if (formField.key === key) {
            throw new Error(`form field with key <${ key }> already exists`);
          }
        });
      }

      const path = [];

      if (parent) {
        path.push(...getParentPath(parent));
      }

      // Set form field path
      formField.path = [...path, key];
    }

    const id = generateIdForType(type);

    // Set form field ID
    formField.id = id;

    this._formFieldRegistry.set(id, formField);

    if (components) {
      this.importFormFields(components, data, id);
    }

    return formField;
  }

  importFormFields(components, data = {}, parent) {
    components.forEach((component) => {
      this.importFormField(component, data, parent);
    });
  }
}

Importer.$inject = [ 'formFieldRegistry', 'formFields' ];

// helpers //////////

function getParentPath(parent) {
  const { path } = parent;

  if (path) {
    return path;
  }

  if (parent.parent) {
    return getParentPath(parent.parent);
  }

  return [];
}