import AddFormFieldHandler from './cmd/AddFormFieldHandler';
import EditFormFieldHandler from './cmd/EditFormFieldHandler';
import MoveFormFieldHandler from './cmd/MoveFormFieldHandler';
import RemoveFormFieldHandler from './cmd/RemoveFormFieldHandler';

import { isObject } from 'min-dash';


export default class Modeling {
  constructor(commandStack, eventBus, formEditor, formFieldRegistry, fieldFactory) {
    this._commandStack = commandStack;
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
    this._fieldFactory = fieldFactory;

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

  addFormField(attrs, targetFormField, targetIndex) {

    const formField = this._fieldFactory.create(attrs);

    const context = {
      formField,
      targetFormField,
      targetIndex
    };

    this._commandStack.execute('formField.add', context);

    return formField;
  }

  editFormField(formField, properties, value) {
    if (!isObject(properties)) {
      properties = {
        [ properties ]: value
      };
    }

    const context = {
      formField,
      properties
    };

    this._commandStack.execute('formField.edit', context);
  }

  moveFormField(formField, sourceFormField, targetFormField, sourceIndex, targetIndex) {
    const context = {
      formField,
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex
    };

    this._commandStack.execute('formField.move', context);
  }

  removeFormField(formField, sourceFormField, sourceIndex) {
    const context = {
      formField,
      sourceFormField,
      sourceIndex
    };

    this._commandStack.execute('formField.remove', context);
  }
}

Modeling.$inject = [
  'commandStack',
  'eventBus',
  'formEditor',
  'formFieldRegistry',
  'fieldFactory'
];