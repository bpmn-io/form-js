export default class UpdatePathClaimHandler {

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
      path
    } = context;

    const options = {
      replacements: {
        [ formField.id ]: path
      }
    };

    const valuePaths = [];

    if (claiming) {
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed }) => {
        const valuePath = this._pathRegistry.getValuePath(field, options);
        valuePaths.push({ valuePath, isClosed });
        this._pathRegistry.claimPath(valuePath, isClosed);
      });
    } else {
      this._pathRegistry.executeRecursivelyOnFields(formField, ({ field, isClosed }) => {
        const valuePath = this._pathRegistry.getValuePath(field, options);
        valuePaths.push({ valuePath, isClosed });
        this._pathRegistry.unclaimPath(valuePath, isClosed);
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
      valuePaths.forEach(({ valuePath, isClosed }) => {
        this._pathRegistry.claimPath(valuePath, isClosed);
      });
    }
  }
}

UpdatePathClaimHandler.$inject = [ 'pathRegistry' ];