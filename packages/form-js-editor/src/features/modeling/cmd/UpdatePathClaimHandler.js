export class UpdatePathClaimHandler {

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
      path
    } = context;

    const options = {
      replacements: {
        [ formField.id ]: path
      }
    };

    const valuePaths = [];

    if (claiming) {
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed, isRepeatable }) => {
        const valuePath = this._pathRegistry.getValuePath(field, options);
        valuePaths.push({ valuePath, isClosed, isRepeatable, claimerId: field.id });
        this._pathRegistry.claimPath(valuePath, { isClosed, isRepeatable, claimerId: field.id });
      });
    } else {
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed, isRepeatable }) => {
        const valuePath = this._pathRegistry.getValuePath(field, options);
        valuePaths.push({ valuePath, isClosed, isRepeatable, claimerId: field.id });
        this._pathRegistry.unclaimPath(valuePath);
      });
    }

    // cache path info for revert
    context.valuePaths = valuePaths;
  }

  revert(context) {
    const {
      claiming,
      valuePaths
    } = context;

    if (claiming) {
      valuePaths.forEach(({ valuePath })=> {
        this._pathRegistry.unclaimPath(valuePath);
      });
    } else {
      valuePaths.forEach(({ valuePath, isClosed, isRepeatable, claimerId }) => {
        this._pathRegistry.claimPath(valuePath, {
          isClosed,
          isRepeatable,
          claimerId
        });
      });
    }
  }
}

UpdatePathClaimHandler.$inject = [ 'pathRegistry' ];