import { get } from 'min-dash';

export default class RepeatRenderManager {

  constructor(form, formFields, formFieldRegistry, pathRegistry) {
    this._form = form;
    this._formFields = formFields;
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this.Repeater = this.Repeater.bind(this);
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

  Repeater(props) {

    const { ElementRenderer, indexes } = props;
    const { data } = this._form._state;

    const repeaterField = props.field;
    const dataPath = this._pathRegistry.getValuePath(repeaterField, { indexes });
    const values = get(data, dataPath) || [];

    return (
      <>
        {values.map((_, index) => {
          const elementProps = {
            ...props,
            indexes: { ...(indexes || {}), [ repeaterField.id ]: index },
          };

          return <ElementRenderer { ...elementProps } />;
        })}
      </>
    );
  }
}

RepeatRenderManager.$inject = [ 'form', 'formFields', 'formFieldRegistry', 'pathRegistry' ];