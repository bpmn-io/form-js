import { AddFormFieldHandler } from './cmd/AddFormFieldHandler';
import { EditFormFieldHandler } from './cmd/EditFormFieldHandler';
import { MoveFormFieldHandler } from './cmd/MoveFormFieldHandler';
import { RemoveFormFieldHandler } from './cmd/RemoveFormFieldHandler';
import { UpdateIdClaimHandler } from './cmd/UpdateIdClaimHandler';
import { UpdateKeyClaimHandler } from './cmd/UpdateKeyClaimHandler';
import { UpdatePathClaimHandler } from './cmd/UpdatePathClaimHandler';

import { isObject } from 'min-dash';


export class Modeling {
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
      'formField.remove': RemoveFormFieldHandler,
      'id.updateClaim': UpdateIdClaimHandler,
      'key.updateClaim': UpdateKeyClaimHandler,
      'path.updateClaim': UpdatePathClaimHandler
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

  moveFormField(formField, sourceFormField, targetFormField, sourceIndex, targetIndex, sourceRow, targetRow) {
    const context = {
      formField,
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex,
      sourceRow,
      targetRow
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

  claimId(formField, id) {
    const context = {
      formField,
      id,
      claiming: true
    };

    this._commandStack.execute('id.updateClaim', context);
  }

  unclaimId(formField, id) {
    const context = {
      formField,
      id,
      claiming: false
    };

    this._commandStack.execute('id.updateClaim', context);
  }

  claimKey(formField, key) {
    const context = {
      formField,
      key,
      claiming: true
    };

    this._commandStack.execute('key.updateClaim', context);
  }

  unclaimKey(formField, key) {
    const context = {
      formField,
      key,
      claiming: false
    };

    this._commandStack.execute('key.updateClaim', context);
  }

  claimPath(formField, path) {
    const context = {
      formField,
      path,
      claiming: true
    };

    this._commandStack.execute('path.updateClaim', context);
  }

  unclaimPath(formField, path) {
    const context = {
      formField,
      path,
      claiming: false
    };

    this._commandStack.execute('path.updateClaim', context);
  }
}

Modeling.$inject = [
  'commandStack',
  'eventBus',
  'formEditor',
  'formFieldRegistry',
  'fieldFactory'
];