import { get } from 'min-dash';
import { useContext, useMemo } from 'preact/hooks';
import LocalExpressionContext from '../../render/context/LocalExpressionContext';

import ExpandSvg from '../../render/components/form-fields/icons/Expand.svg';
import CollapseSvg from '../../render/components/form-fields/icons/Collapse.svg';
import XMarkSvg from '../../render/components/form-fields/icons/XMark.svg';
import { wrapExpressionContext } from '../../util';

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

    const onDeleteItem = (index) => {

      const updatedValues = values.slice();
      updatedValues.splice(index, 1);

      props.onChange({
        field: repeaterField,
        value: updatedValues,
        indexes
      });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const parentExpressionContext = useContext(LocalExpressionContext);

    return (
      <>
        {displayValues.map((value, index) => {
          const elementProps = {
            ...restProps,
            indexes: { ...(indexes || {}), [ repeaterField.id ]: index },
          };

          const localExpressionContext = useMemo(() => ({
            this: value,
            parent: wrapExpressionContext(parentExpressionContext.this, parentExpressionContext),
            i: [ ...parentExpressionContext.i , index + 1 ]
          }), [ index, value ]);

          return <div class="fjs-repeat-row-container">
            <LocalExpressionContext.Provider value={ localExpressionContext }>
              <RowsRenderer { ...elementProps } />
            </LocalExpressionContext.Provider>
            <div class="fjs-repeat-row-delete-container">
              <button class="fjs-repeat-row-delete" onClick={ () => onDeleteItem(index) }>
                <XMarkSvg />
              </button>
            </div>
          </div>;
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

    const onAddItem = () => {
      const updatedValues = values.slice();
      const newItem = this._form._getInitializedFieldData(this._form._state.data, {
        customRoot : repeaterField,
        customIndexes : { ...indexes, [ repeaterField.id ]: updatedValues.length }
      });

      updatedValues.push(newItem);

      props.onChange({
        field: repeaterField,
        value: updatedValues,
        indexes
      });
    };

    return <div className="fjs-repeat-render-footer">
      <button onClick={ onAddItem }>add</button>
      { togglingEnabled ? <button onClick={ toggle }>
        {
          isCollapsed
            ? <><ExpandSvg /> { `Expand all (${values.length})` }</>
            : <><CollapseSvg /> { 'Collapse' }</>
        }
      </button> : null }
    </div>;
  }

  _getNonCollapsedItems(field) {
    const DEFAULT_NON_COLLAPSED_ITEMS = 5;

    const { nonCollapsedItems } = field;

    return nonCollapsedItems ? nonCollapsedItems : DEFAULT_NON_COLLAPSED_ITEMS;
  }

}

RepeatRenderManager.$inject = [ 'form', 'formFields', 'formFieldRegistry', 'pathRegistry' ];