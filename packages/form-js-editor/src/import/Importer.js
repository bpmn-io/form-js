import { generateIdForType } from '@bpmn-io/form-js-viewer';

export default class Importer {

  /**
   * @constructor
   * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
   * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
   */
  constructor(formFieldRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
  }

  /**
   * Import schema adding `_id`, `_parent` and `_path` information to each field and adding it to the form field registry.
   *
   * @param {any} schema
   *
   * @returns {Promise}
   */
  importSchema(schema) {
    this._formFieldRegistry.clear();

    // TODO: Add warnings
    const warnings = [];

    return new Promise((resolve, reject) => {
      try {
        this.importFormField(schema);
      } catch (err) {
        err.warnings = warnings;

        reject(err);
      }

      resolve({ warnings });
    });
  }

  importFormField(formField, parentId, index) {
    const {
      components,
      key,
      type
    } = formField;

    let parent;

    if (parentId) {

      // Set form field parent
      formField._parent = parentId;

      parent = this._formFieldRegistry.get(parentId);
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
    }

    // Set form field path
    if (parent) {
      formField._path = [ ...parent._path, 'components', index ];
    } else {
      formField._path = [];
    }

    const _id = generateIdForType(type);

    // Set form field ID
    formField._id = _id;

    this._formFieldRegistry.set(_id, formField);

    if (components) {
      this.importFormFields(components, _id);
    }

    return formField;
  }

  importFormFields(components, parent) {
    components.forEach((component, index) => {
      this.importFormField(component, parent, index);
    });
  }
}

Importer.$inject = [ 'formFieldRegistry', 'formFields' ];