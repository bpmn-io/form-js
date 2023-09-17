export default class RepeatRenderManager {

  /** TODO: do we need to maintain keys list for preact rendering ? 9*/

  constructor(formFieldRegistry, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._formFields = formFields;
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
    const { ElementRenderer } = props;
    const parentId = props.field.id;
    const renderElements = [ 1, 2, 3, 4, 5 ];

    return (
      <>
        {renderElements.map((renderElement, index) => {
          const elementProps = {
            ...props,
            indexes: { ...props.indexes, [parentId]: index },
          };

          return <ElementRenderer { ...elementProps } />;
        })}
      </>
    );
  }
}

RepeatRenderManager.$inject = [ 'formFieldRegistry', 'formFields' ];