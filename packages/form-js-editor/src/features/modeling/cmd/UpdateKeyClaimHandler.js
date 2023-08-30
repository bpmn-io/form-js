export default class UpdateKeyClaimHandler {

  /**
   * @constructor
   * @param { import('@bpmn-io/form-js-viewer/PathRegistry').default } pathRegistry
   */
  constructor(pathRegistry) {
    this._pathRegistry = pathRegistry;
  }

  execute(context) {
    const {
      claiming,
      formField,
      key
    } = context;

    const options = {
      replacements: {
        [ formField.id ]: key
      }
    };

    const valuePath = this._pathRegistry.getValuePath(formField, options);

    if (claiming) {
      this._pathRegistry.claimPath(valuePath, true);
    } else {
      this._pathRegistry.unclaimPath(valuePath);
    }

    // cache path for revert
    context.valuePath = valuePath;
  }

  revert(context) {
    const {
      claiming,
      valuePath
    } = context;

    if (claiming) {
      this._pathRegistry.unclaimPath(valuePath);
    } else {
      this._pathRegistry.claimPath(valuePath, true);
    }
  }
}

UpdateKeyClaimHandler.$inject = [ 'pathRegistry' ];