import { get } from 'min-dash';

import {
  arrayAdd,
  arrayRemove,
  updatePath
} from './Util';

export default class AddFormFieldHandler {

  /**
   * @constructor
   * @param { import('../../FormEditor').default } formEditor
   * @param { import('../FormFieldRegistry').default } formFieldRegistry
   */
  constructor(formEditor, formFieldRegistry) {
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
  }

  execute(context) {
    const {
      newFormField,
      targetFormField,
      targetIndex
    } = context;

    let { schema } = this._formEditor._getState();

    const targetPath = [ ...targetFormField._path, 'components' ];

    newFormField._parent = targetFormField.id;

    // (1) Add new form field
    arrayAdd(get(schema, targetPath), targetIndex, newFormField);

    // (2) Update paths of new form field and its siblings
    get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Add new form field to form field registry
    this._formFieldRegistry.set(newFormField.id, newFormField);

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }

  revert(context) {
    const {
      newFormField,
      targetFormField,
      targetIndex
    } = context;

    let { schema } = this._formEditor._getState();

    const targetPath = [ ...targetFormField._path, 'components' ];

    // (1) Remove new form field
    arrayRemove(get(schema, targetPath), targetIndex);

    // (2) Update paths of new form field and its siblings
    get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Remove new form field from form field registry
    this._formFieldRegistry.delete(newFormField.id);

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

AddFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];