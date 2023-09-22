import { get } from 'min-dash';

import ExpandSvg from '../../render/components/form-fields/icons/Expand.svg';
import CollapseSvg from '../../render/components/form-fields/icons/Collapse.svg';

export default class RepeatRenderManager {

  constructor(form, formFields, formFieldRegistry, pathRegistry) {
    this._form = form;
    this._formFields = formFields;
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this.Repeater = this.Repeater.bind(this);
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

  Repeater(props) {

    const { RowsRenderer, indexes, useSharedState, ...restProps } = props;

    const [ sharedRepeatState ] = useSharedState;

    const { data } = this._form._state;

    const repeaterField = props.field;
    const dataPath = this._pathRegistry.getValuePath(repeaterField, { indexes });
    const values = get(data, dataPath) || [];

    const nonCollapsedItems = this._getNonCollapsedItems(repeaterField);
    const isCollapsed = sharedRepeatState.isCollapsed && values.length > nonCollapsedItems;

    const displayValues = isCollapsed ? values.slice(0, nonCollapsedItems) : values;

    return (
      <>
        {displayValues.map((_, index) => {
          const elementProps = {
            ...restProps,
            indexes: { ...(indexes || {}), [ repeaterField.id ]: index },
          };

          return <RowsRenderer { ...elementProps } />;
        })}
      </>
    );
  }

  RepeatFooter(props) {

    const { useSharedState, indexes } = props;
    const [ sharedRepeatState, setSharedRepeatState ] = useSharedState;

    const { data } = this._form._state;

    const repeaterField = props.field;
    const dataPath = this._pathRegistry.getValuePath(repeaterField, { indexes });
    const values = get(data, dataPath) || [];

    const nonCollapsedItems = this._getNonCollapsedItems(repeaterField);
    const togglingEnabled = values.length > nonCollapsedItems;
    const isCollapsed = sharedRepeatState.isCollapsed;

    const toggle = () => {
      setSharedRepeatState(state => ({ ...state, isCollapsed: !isCollapsed }));
    };

    return togglingEnabled
      ? <div className="fjs-repeat-render-footer">
        <button onClick={ toggle }>
          {
            isCollapsed
              ? <><ExpandSvg /> { `Expand all (${values.length})` }</>
              : <><CollapseSvg /> { 'Collapse' }</>
          }
        </button>
      </div>
      : null;
  }

  _getNonCollapsedItems(field) {
    const DEFAULT_NON_COLLAPSED_ITEMS = 5;

    const { nonCollapsedItems } = field;

    return nonCollapsedItems ? nonCollapsedItems : DEFAULT_NON_COLLAPSED_ITEMS;
  }

}

RepeatRenderManager.$inject = [ 'form', 'formFields', 'formFieldRegistry', 'pathRegistry' ];