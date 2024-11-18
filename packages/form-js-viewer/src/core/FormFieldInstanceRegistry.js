export class FormFieldInstanceRegistry {
  constructor(eventBus, formFieldRegistry, formFields) {
    this._eventBus = eventBus;
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;

    this._formFieldInstances = {};

    eventBus.on('form.clear', () => this.clear());
  }

  syncInstance(instanceId, formFieldInfo) {
    const { hidden, ...restInfo } = formFieldInfo;

    const isInstanceExpected = !hidden;
    const doesInstanceExist = this._formFieldInstances[instanceId];

    if (isInstanceExpected && !doesInstanceExist) {
      this._formFieldInstances[instanceId] = {
        instanceId,
        ...restInfo,
      };

      this._eventBus.fire('formFieldInstance.added', { instanceId });
    } else if (!isInstanceExpected && doesInstanceExist) {
      delete this._formFieldInstances[instanceId];

      this._eventBus.fire('formFieldInstance.removed', { instanceId });
    } else if (isInstanceExpected && doesInstanceExist) {
      const wasInstanceChanged = Object.keys(restInfo).some((key) => {
        return this._formFieldInstances[instanceId][key] !== restInfo[key];
      });

      if (wasInstanceChanged) {
        this._formFieldInstances[instanceId] = {
          instanceId,
          ...restInfo,
        };

        this._eventBus.fire('formFieldInstance.changed', { instanceId });
      }
    }

    return instanceId;
  }

  cleanupInstance(instanceId) {
    if (this._formFieldInstances[instanceId]) {
      delete this._formFieldInstances[instanceId];
      this._eventBus.fire('formFieldInstance.removed', { instanceId });
    }
  }

  get(instanceId) {
    return this._formFieldInstances[instanceId];
  }

  getAll() {
    return Object.values(this._formFieldInstances);
  }

  getAllKeyed() {
    return this.getAll().filter(({ id }) => {
      const formFieldDefinition = this._formFieldRegistry.get(id);

      if (!formFieldDefinition) {
        return false;
      }

      const { type } = formFieldDefinition;
      const { config } = this._formFields.get(type);

      return config.keyed;
    });
  }

  clear() {
    this._formFieldInstances = {};
  }
}

FormFieldInstanceRegistry.$inject = ['eventBus', 'formFieldRegistry', 'formFields'];
