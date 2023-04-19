export default class FieldFactory {

  /**
   * @constructor
   *
   * @param { import('./FormFieldRegistry').default } formFieldRegistry
   * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
   */
  constructor(formFieldRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
  }

  create(attrs, applyDefaults = true) {

    const {
      id,
      key,
      type
    } = attrs;

    const fieldDefinition = this._formFields.get(type);

    if (!fieldDefinition) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    const { config } = fieldDefinition;

    if (id && this._formFieldRegistry._ids.assigned(id)) {
      throw new Error(`ID <${ id }> already assigned`);
    }

    if (key && this._formFieldRegistry._keys.assigned(key)) {
      throw new Error(`key <${ key }> already assigned`);
    }

    const labelAttrs = applyDefaults && config.label ? {
      label: config.label
    } : {};

    const field = config.create({
      ...labelAttrs,
      ...attrs
    });

    this._ensureId(field);

    if (config.keyed) {
      this._ensureKey(field, applyDefaults);
    }

    return field;
  }

  _ensureId(field) {

    if (field.id) {
      this._formFieldRegistry._ids.claim(field.id, field);

      return;
    }

    let prefix = 'Field';

    if (field.type === 'default') {
      prefix = 'Form';
    }

    field.id = this._formFieldRegistry._ids.nextPrefixed(`${prefix}_`, field);
  }

  _ensureKey(field, applyDefaults) {

    if (field.key) {
      this._formFieldRegistry._keys.claim(field.key, field);

      return;
    }

    if (applyDefaults) {
      let prefix = 'field';

      field.key = this._formFieldRegistry._keys.nextPrefixed(`${prefix}_`, field);
    }
  }
}


FieldFactory.$inject = [
  'formFieldRegistry',
  'formFields'
];