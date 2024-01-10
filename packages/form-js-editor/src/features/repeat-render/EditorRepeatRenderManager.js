import RepeatSvg from '../../render/components/icons/Repeat.svg';

export class EditorRepeatRenderManager {

  constructor(formFields, formFieldRegistry) {
    this._formFields = formFields;
    this._formFieldRegistry = formFieldRegistry;
    this.RepeatFooter = this.RepeatFooter.bind(this);
  }

  /**
   * Checks whether a field should be repeatable.
   *
   * @param {string} id - The id of the field to check
   * @returns {boolean} - True if repeatable, false otherwise
   */
  isFieldRepeating(id) {

    if (!id) {
      return false;
    }

    const formField = this._formFieldRegistry.get(id);
    const formFieldDefinition = this._formFields.get(formField.type);
    return formFieldDefinition.config.repeatable && formField.isRepeating;
  }

  RepeatFooter() {
    return <div className="fjs-repeat-render-footer"><RepeatSvg /><span>Repeatable</span></div>;
  }

}

EditorRepeatRenderManager.$inject = [ 'formFields', 'formFieldRegistry' ];