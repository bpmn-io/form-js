export default class EditFormFieldHandler {

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
      formField,
      key,
      value
    } = context;

    let { schema } = this._formEditor._getState();

    context.oldValue = formField[ key ];

    // (1) Edit form field
    formField[ key ] = value;

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }

  revert(context) {
    const {
      formField,
      key,
      oldValue
    } = context;

    let { schema } = this._formEditor._getState();

    // (1) Edit form field
    formField[ key ] = oldValue;

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });
  }
}

EditFormFieldHandler.$inject = [ 'formEditor', 'formFieldRegistry' ];