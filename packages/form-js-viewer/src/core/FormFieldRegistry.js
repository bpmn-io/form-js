import Ids from 'ids';

export default class FormFieldRegistry {
  constructor(eventBus) {
    this._eventBus = eventBus;

    this._formFields = {};

    eventBus.on('form.clear', () => this.clear());

    this._ids = new Ids([ 32, 36, 1 ]);
    this._keys = new Ids([ 32, 36, 1 ]);
  }

  add(formField) {
    const { id } = formField;

    if (this._formFields[ id ]) {
      throw new Error(`form field with ID ${ id } already exists`);
    }

    this._eventBus.fire('formField.add', { formField });

    this._formFields[ id ] = formField;
  }

  remove(formField) {
    const { id } = formField;

    if (!this._formFields[ id ]) {
      return;
    }

    this._eventBus.fire('formField.remove', { formField });

    delete this._formFields[ id ];
  }

  get(id) {
    return this._formFields[ id ];
  }

  getAll() {
    return Object.values(this._formFields);
  }

  forEach(callback) {
    this.getAll().forEach((formField) => callback(formField));
  }

  clear() {
    this._formFields = {};

    this._ids.clear();
    this._keys.clear();
  }

}

FormFieldRegistry.$inject = [ 'eventBus' ];