import Ids from 'ids';


export default class FieldFactory {

  /**
   * @constructor
   *
   * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
   * @param { import('./EventBus').default } eventBus
   */
  constructor(formFields, eventBus) {
    this._ids = new Ids([ 32, 36, 1 ]);

    this._num = 0;

    this._formFields = formFields;

    eventBus.on('diagram.clear', () => {
      this._num = 0;
      this._ids.clear();
    });
  }

  create(attrs) {

    const {
      type,
      key
    } = attrs;

    const fieldDefinition = this._formFields.get(type);

    if (!fieldDefinition) {
      throw new Error(`form field of type <${ type }> not supported`);
    }

    const labelAttrs = fieldDefinition.label ? {
      label: fieldDefinition.label
    } : {};

    const keyAttrs = fieldDefinition.keyed ? {
      key: `field_${ (this._num++) }`
    } : {};

    const field = fieldDefinition.create({
      ...keyAttrs,
      ...labelAttrs,
      ...attrs
    });

    this._ensureId(field);

    return field;
  }

  _ensureId(field) {

    if (field.id) {
      return;
    }

    let prefix = 'Field';

    if (field.type === 'default') {
      prefix = 'Form';
    }

    field.id = this._ids.nextPrefixed(`${prefix}_`);
  }
}


FieldFactory.$inject = [
  'formFields',
  'eventBus'
];