export class UpdateKeyClaimHandler {

  /**
   * @constructor
   * @param { import('@bpmn-io/form-js-viewer').PathRegistry } pathRegistry
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
      this._pathRegistry.claimPath(valuePath, { isClosed: true, claimerId: formField.id });
    } else {
      this._pathRegistry.unclaimPath(valuePath);
    }

    // cache path for revert
    context.valuePath = valuePath;
  }

  revert(context) {
    const {
      claiming,
      formField,
      valuePath
    } = context;

    if (claiming) {
      this._pathRegistry.unclaimPath(valuePath);
    } else {
      this._pathRegistry.claimPath(valuePath, { isClosed: true, claimerId: formField.id });
    }
  }
}

UpdateKeyClaimHandler.$inject = [ 'pathRegistry' ];