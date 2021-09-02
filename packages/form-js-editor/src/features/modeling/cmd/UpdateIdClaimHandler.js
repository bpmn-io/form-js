export default class UpdateIdClaimHandler {

  /**
   * @constructor
   * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
   */
  constructor(formFieldRegistry) {
    this._formFieldRegistry = formFieldRegistry;
  }

  execute(context) {
    const {
      claiming,
      formField,
      id
    } = context;

    if (claiming) {
      this._formFieldRegistry._ids.claim(id, formField);
    } else {
      this._formFieldRegistry._ids.unclaim(id);
    }
  }

  revert(context) {
    const {
      claiming,
      formField,
      id
    } = context;

    if (claiming) {
      this._formFieldRegistry._ids.unclaim(id);
    } else {
      this._formFieldRegistry._ids.claim(id, formField);
    }
  }
}

UpdateIdClaimHandler.$inject = [ 'formFieldRegistry' ];