import AddFormFieldHandler from './cmd/AddFormFieldHandler';
import EditFormFieldHandler from './cmd/EditFormFieldHandler';
import MoveFormFieldHandler from './cmd/MoveFormFieldHandler';
import RemoveFormFieldHandler from './cmd/RemoveFormFieldHandler';


export default class Modeling {
  constructor(commandStack, eventBus, formEditor, formFieldRegistry) {
    this._commandStack = commandStack;
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;

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
      'formField.add': AddFormFieldHandler,
      'formField.edit': EditFormFieldHandler,
      'formField.move': MoveFormFieldHandler,
      'formField.remove': RemoveFormFieldHandler
    };
  }

  addFormField(targetFormField, targetIndex, newFormField) {
    const context = {
      newFormField,
      targetFormField,
      targetIndex
    };

    this._commandStack.execute('formField.add', context);
  }

  editFormField(formField, key, value) {
    const context = {
      formField,
      key,
      value
    };

    this._commandStack.execute('formField.edit', context);
  }

  moveFormField(sourceFormField, targetFormField, sourceIndex, targetIndex) {
    const context = {
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex
    };

    this._commandStack.execute('formField.move', context);
  }

  removeFormField(sourceFormField, sourceIndex) {
    const context = {
      sourceFormField,
      sourceIndex
    };

    this._commandStack.execute('formField.remove', context);
  }
}

Modeling.$inject = [ 'commandStack', 'eventBus', 'formEditor', 'formFieldRegistry' ];