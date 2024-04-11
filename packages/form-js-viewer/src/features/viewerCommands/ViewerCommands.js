import { UpdateFieldValidationHandler } from './cmd/UpdateFieldValidationHandler';
import { UpdateFieldInstanceValidationHandler } from './cmd/UpdateFieldInstanceValidationHandler';

export class ViewerCommands {
  constructor(commandStack, eventBus) {
    this._commandStack = commandStack;

    eventBus.on('form.init', () => {
      this.registerHandlers();
    });
  }

  registerHandlers() {
    Object.entries(this.getHandlers()).forEach(([id, handler]) => {
      this._commandStack.registerHandler(id, handler);
    });
  }

  getHandlers() {
    return {
      'formField.validation.update': UpdateFieldValidationHandler,
      'formFieldInstance.validation.update': UpdateFieldInstanceValidationHandler,
    };
  }

  /**
   * @deprecated
   */
  updateFieldValidation(field, value, indexes) {
    const context = {
      field,
      value,
      indexes,
    };

    this._commandStack.execute('formField.validation.update', context);
  }

  updateFieldInstanceValidation(fieldInstance, value) {
    const context = {
      fieldInstance,
      value,
    };

    this._commandStack.execute('formFieldInstance.validation.update', context);
  }
}

ViewerCommands.$inject = ['commandStack', 'eventBus'];
