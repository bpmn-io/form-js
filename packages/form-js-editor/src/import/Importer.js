import { generateIdForType, clone } from '@bpmn-io/form-js-viewer';


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
   * Import schema adding `id`, `_parent` and `_path`
   * information to each field and adding it to the
   * form field registry.
   *
   * @param {any} schema
   *
   * @returns { { warnings: Array<any>, schema: any } }
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

  importFormField(formField, parentId, index) {
    const {
      components,
      key,
      type,
      id = generateIdForType(type)
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

    if (id) {
      this._formFieldRegistry.forEach((formField) => {
        if (formField.id === id) {
          throw new Error(`form field with id <${ id }> already exists`);
        }
      });
    }

    // Set form field path
    if (parent) {
      formField._path = [ ...parent._path, 'components', index ];
    } else {
      formField._path = [];
    }

    // Set form field ID
    formField.id = id;

    this._formFieldRegistry.set(id, formField);

    if (components) {
      this.importFormFields(components, id);
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