export class FormFieldInstanceRegistry {
  constructor(eventBus, formFieldRegistry, formFields) {
    this._eventBus = eventBus;
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;

    this._formFieldInstances = {};

    eventBus.on('form.clear', () => this.clear());
  }

  add(instance) {
    const { id, expressionContextInfo, valuePath, indexes } = instance;

    const instanceId = [id, ...Object.values(indexes || {})].join('_');

    if (this._formFieldInstances[instanceId]) {
      throw new Error('this form field instance is already registered');
    }

    this._formFieldInstances[instanceId] = {
      id,
      instanceId,
      expressionContextInfo,
      valuePath,
      indexes,
    };

    return instanceId;
  }

  remove(instanceId) {
    if (!this._formFieldInstances[instanceId]) {
      return;
    }

    delete this._formFieldInstances[instanceId];
  }

  getAll() {
    return Object.values(this._formFieldInstances);
  }

  getAllKeyed() {
    return this.getAll().filter(({ id }) => {
      const { type } = this._formFieldRegistry.get(id);
      const { config } = this._formFields.get(type);

      return config.keyed;
    });
  }

  clear() {
    this._formFieldInstances = {};
  }
}

FormFieldInstanceRegistry.$inject = ['eventBus', 'formFieldRegistry', 'formFields'];
