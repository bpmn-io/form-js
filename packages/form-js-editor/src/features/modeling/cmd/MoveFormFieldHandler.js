import { get } from 'min-dash';

import {
  arrayAdd,
  arrayMove,
  arrayRemove,
  updatePath,
  updateRow
} from './Util';

export default class MoveFormFieldHandler {

  /**
   * @constructor
   * @param { import('../../../FormEditor').default } formEditor
   * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
   */
  constructor(formEditor, formFieldRegistry) {
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
  }

  execute(context) {
    this.moveFormField(context);
  }

  revert(context) {
    let {
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex,
      sourceRow,
      targetRow
    } = context;

    this.moveFormField({
      sourceFormField: targetFormField,
      targetFormField: sourceFormField,
      sourceIndex: targetIndex,
      targetIndex: sourceIndex,
      sourceRow: targetRow,
      targetRow: sourceRow
    }, true);
  }

  moveFormField(context, revert) {
    let {
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex,
      targetRow
    } = context;

    let { schema } = this._formEditor._getState();

    const sourcePath = [ ...sourceFormField._path, 'components' ];

    if (sourceFormField.id === targetFormField.id) {

      if (revert) {
        if (sourceIndex > targetIndex) {
          sourceIndex--;
        }
      } else {
        if (sourceIndex < targetIndex) {
          targetIndex--;
        }
      }

      const formField = get(schema, [ ...sourcePath, sourceIndex ]);

      // (1) Add to row
      updateRow(formField, targetRow ? targetRow.id : null);

      // (2) Move form field
      arrayMove(get(schema, sourcePath), sourceIndex, targetIndex);

      // (3) Update paths of new form field and its siblings
      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    } else {
      const formField = get(schema, [ ...sourcePath, sourceIndex ]);

      formField._parent = targetFormField.id;

      // (1) Remove form field
      arrayRemove(get(schema, sourcePath), sourceIndex);

      // (2) Update paths of siblings
      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      const targetPath = [ ...targetFormField._path, 'components' ];

      // (3) Add to row
      updateRow(formField, targetRow ? targetRow.id : null);

      // (4) Add form field
      arrayAdd(get(schema, targetPath), targetIndex, formField);

      // (5) Update paths of siblings
      get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
    }

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

MoveFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];