import { get } from 'min-dash';

import {
  arrayAdd,
  arrayRemove,
  updatePath
} from './Util';

import {
  runRecursively
} from '@bpmn-io/form-js-viewer';

export class RemoveFormFieldHandler {

  /**
   * @constructor
   * @param { import('../../../FormEditor').FormEditor } formEditor
   * @param { import('../../../core/FormFieldRegistry').FormFieldRegistry } formFieldRegistry
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

    // (2) Update internal paths of its siblings (and their children)
    get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Remove form field and children from form field registry
    runRecursively(formField, (formField) => this._formFieldRegistry.remove(formField));

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

    // (2) Update internal paths of its siblings (and their children)
    get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));

    // (3) Add form field and children to form field registry
    runRecursively(formField, (formField) => this._formFieldRegistry.add(formField));

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

RemoveFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];