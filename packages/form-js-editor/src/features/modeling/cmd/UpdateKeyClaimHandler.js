export default class UpdateKeyClaimHandler {

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
      key
    } = context;

    if (claiming) {
      this._formFieldRegistry._keys.claim(key, formField);
    } else {
      this._formFieldRegistry._keys.unclaim(key);
    }
  }

  revert(context) {
    const {
      claiming,
      formField,
      key
    } = context;

    if (claiming) {
      this._formFieldRegistry._keys.unclaim(key);
    } else {
      this._formFieldRegistry._keys.claim(key, formField);
    }
  }
}

UpdateKeyClaimHandler.$inject = [ 'formFieldRegistry' ];