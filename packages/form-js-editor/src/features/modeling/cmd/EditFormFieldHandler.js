export default class EditFormFieldHandler {

  /**
   * @constructor
   * @param { import('../../FormEditor').default } formEditor
   * @param { import('@bpmn-io/form-js-viewer').FormFieldRegistry } formFieldRegistry
   */
  constructor(formEditor, formFieldRegistry) {
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;
  }

  execute(context) {
    const {
      formField,
      properties
    } = context;

    let { schema } = this._formEditor._getState();

    const oldProperties = {};

    for (let key in properties) {
      oldProperties[ key ] = formField[ key ];

      formField[ key ] = properties[ key ];
    }

    context.oldProperties = oldProperties;

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }

  revert(context) {
    const {
      formField,
      oldProperties
    } = context;

    let { schema } = this._formEditor._getState();

    for (let key in oldProperties) {

      formField[ key ] = oldProperties[ key ];
    }

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

EditFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];