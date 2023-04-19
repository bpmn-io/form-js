import UpdateFieldValidationHandler from './cmd/UpdateFieldValidationHandler';

export default class ViewerCommands {
  constructor(commandStack, eventBus) {
    this._commandStack = commandStack;

    eventBus.on('form.init', () => {
      this.registerHandlers();
    });
  }

  registerHandlers() {
    Object.entries(this.getHandlers()).forEach(([ id, handler ]) => {
      this._commandStack.registerHandler(id, handler);
    });
  }

  getHandlers() {
    return {
      'formField.validation.update': UpdateFieldValidationHandler
    };
  }

  updateFieldValidation(field, value) {
    const context = {
      field,
      value
    };

    this._commandStack.execute('formField.validation.update', context);
  }

}

ViewerCommands.$inject = [
  'commandStack',
  'eventBus'
];