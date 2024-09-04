export class FormFieldInstanceRegistry {
  constructor(eventBus, formFieldRegistry, formFields) {
    this._eventBus = eventBus;
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;

    this._formFieldInstances = {};

    eventBus.on('form.clear', () => this.clear());
  }

  syncInstance(instanceId, formFieldInfo) {
    const { id, expressionContextInfo, valuePath, indexes, hidden } = formFieldInfo;

    const instanceIsExpected = !hidden;
    const instanceExists = this._formFieldInstances[instanceId];

    if (instanceIsExpected && !instanceExists) {
      this._formFieldInstances[instanceId] = {
        id,
        instanceId,
        expressionContextInfo,
        valuePath,
        indexes,
      };

      this._eventBus.fire('formFieldInstance.added', { instanceId });
    } else if (!instanceIsExpected && instanceExists) {
      delete this._formFieldInstances[instanceId];

      this._eventBus.fire('formFieldInstance.removed', { instanceId });
    } else if (instanceIsExpected && instanceExists) {
      const instanceChanged =
        this._formFieldInstances[instanceId].id !== id ||
        // todo: not a new problem, but this almost always changes due to fact that we don't trim the expression context based on used variables
        this._formFieldInstances[instanceId].expressionContextInfo !== expressionContextInfo ||
        this._formFieldInstances[instanceId].valuePath !== valuePath ||
        this._formFieldInstances[instanceId].indexes !== indexes;

      if (instanceChanged) {
        this._formFieldInstances[instanceId] = {
          id,
          instanceId,
          expressionContextInfo,
          valuePath,
          indexes,
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
