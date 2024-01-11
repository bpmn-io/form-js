import { get } from 'min-dash';

import {
  arrayAdd,
  arrayMove,
  arrayRemove,
  updatePath,
  updateRow
} from './Util';

export class MoveFormFieldHandler {

  /**
   * @constructor
   * @param { import('../../../FormEditor').FormEditor } formEditor
   * @param { import('../../../core/FormFieldRegistry').FormFieldRegistry } formFieldRegistry
   * @param { import('@bpmn-io/form-js-viewer').PathRegistry } pathRegistry
   * @param { import('@bpmn-io/form-js-viewer').FormLayouter } formLayouter
   */
  constructor(formEditor, formFieldRegistry, pathRegistry, formLayouter) {
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._formLayouter = formLayouter;
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

      // (1) Add to row or create new one
      updateRow(formField, targetRow ? targetRow.id : this._formLayouter.nextRowId());

      // (2) Move form field
      arrayMove(get(schema, sourcePath), sourceIndex, targetIndex);

      // (3) Update internal paths of new form field and its siblings (and their children)
      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    } else {
      const formField = get(schema, [ ...sourcePath, sourceIndex ]);

      // (1) Deregister form field (and children) from path registry
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field }) => {
        this._pathRegistry.unclaimPath(this._pathRegistry.getValuePath(field));
      });

      formField._parent = targetFormField.id;

      // (2) Remove form field
      arrayRemove(get(schema, sourcePath), sourceIndex);

      // (3) Update internal paths of siblings (and their children)
      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      const targetPath = [ ...targetFormField._path, 'components' ];

      // (4) Add to row or create new one
      updateRow(formField, targetRow ? targetRow.id : this._formLayouter.nextRowId());

      // (5) Add form field
      arrayAdd(get(schema, targetPath), targetIndex, formField);

      // (6) Update internal paths of siblings (and their children)
      get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

      // (7) Reregister form field (and children) from path registry
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed, isRepeatable }) => {
        this._pathRegistry.claimPath(this._pathRegistry.getValuePath(field), {
          isClosed,
          isRepeatable,
          claimerId: field.id
        });
      });
    }

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

MoveFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry', 'pathRegistry', 'formLayouter' ];