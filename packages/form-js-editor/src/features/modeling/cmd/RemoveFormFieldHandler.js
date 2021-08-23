import { get } from 'min-dash';

import {
  arrayAdd,
  arrayRemove,
  updatePath
} from './Util';

export default class RemoveFormFieldHandler {

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
    const {
      sourceFormField,
      sourceIndex
    } = context;

    let { schema } = this._formEditor._getState();

    const sourcePath = [ ...sourceFormField._path, 'components' ];

    const formField = context.formField = get(schema, [ ...sourcePath, sourceIndex ]);

    // (1) Remove form field
    arrayRemove(get(schema, sourcePath), sourceIndex);

    // (2) Update paths of its siblings
    get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Remove form field from form field registry
    this._formFieldRegistry.remove(formField);

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }

  revert(context) {
    const {
      formField,
      sourceFormField,
      sourceIndex
    } = context;

    let { schema } = this._formEditor._getState();

    const sourcePath = [ ...sourceFormField._path, 'components' ];

    // (1) Add form field
    arrayAdd(get(schema, sourcePath), sourceIndex, formField);

    // (2) Update paths of its siblings
    get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Add form field to form field registry
    this._formFieldRegistry.add(formField);

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

RemoveFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];