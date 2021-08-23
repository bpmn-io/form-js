export default class EditFormFieldHandler {

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
      formField,
      properties
    } = context;

    let { schema } = this._formEditor._getState();

    const oldProperties = {};

    for (let key in properties) {
      oldProperties[ key ] = formField[ key ];

      const property = properties[ key ];

      if (key === 'id') {
        if (property !== formField.id) {
          this._formFieldRegistry.updateId(formField, property);
        }
      } else {
        formField[ key ] = property;
      }
    }

    context.oldProperties = oldProperties;

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });

    return formField;
  }

  revert(context) {
    const {
      formField,
      oldProperties
    } = context;

    let { schema } = this._formEditor._getState();

    for (let key in oldProperties) {

      const property = oldProperties[ key ];

      if (key === 'id') {
        if (property !== formField.id) {
          this._formFieldRegistry.updateId(formField, property);
        }
      } else {
        formField[ key ] = property;
      }
    }

    // TODO: Create updater/change support that automatically updates paths and schema on command execution
    this._formEditor._setState({ schema });

    return formField;
  }

}

EditFormFieldHandler.$inject = [
  'formEditor',
  'formFieldRegistry'
];