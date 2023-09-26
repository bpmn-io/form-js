// disable react hook rules as the linter is confusing the functional components within a class as class components
/* eslint-disable react-hooks/rules-of-hooks */

import { get } from 'min-dash';
import { useContext, useMemo, useRef } from 'preact/hooks';
import LocalExpressionContext from '../../render/context/LocalExpressionContext';

import ExpandSvg from '../../render/components/form-fields/icons/Expand.svg';
import CollapseSvg from '../../render/components/form-fields/icons/Collapse.svg';
import AddSvg from '../../render/components/form-fields/icons/Add.svg';
import DeleteSvg from '../../render/components/form-fields/icons/Delete.svg';

import { wrapExpressionContext } from '../../util';
import { useScrollIntoView } from '../../render/hooks';

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

    const { data } = this._form._getState();

    const repeaterField = props.field;
    const dataPath = this._pathRegistry.getValuePath(repeaterField, { indexes });
    const values = get(data, dataPath) || [];

    const nonCollapsedItems = this._getNonCollapsedItems(repeaterField);
    const isCollapsed = sharedRepeatState.isCollapsed && values.length > nonCollapsedItems;
    const hasChildren = repeaterField.components && repeaterField.components.length > 0;
    const showRemove = repeaterField.allowAddRemove && hasChildren;

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

          return !showRemove ?
            <LocalExpressionContext.Provider value={ localExpressionContext }>
              <RowsRenderer { ...elementProps } />
            </LocalExpressionContext.Provider> :
            <div class="fjs-repeat-row-container">
              <div class="fjs-repeat-row-rows">
                <LocalExpressionContext.Provider value={ localExpressionContext }>
                  <RowsRenderer { ...elementProps } />
                </LocalExpressionContext.Provider>
              </div>
              <button class="fjs-repeat-row-remove" onClick={ () => onDeleteItem(index) }>
                <DeleteSvg />
              </button>
            </div>;
        })}
      </>
    );
  }

  RepeatFooter(props) {

    const addButtonRef = useRef(null);
    const { useSharedState, indexes, field: repeaterField } = props;
    const [ sharedRepeatState, setSharedRepeatState ] = useSharedState;

    const { data } = this._form._getState();

    const dataPath = this._pathRegistry.getValuePath(repeaterField, { indexes });
    const values = get(data, dataPath) || [];

    const nonCollapsedItems = this._getNonCollapsedItems(repeaterField);
    const collapseEnabled = !repeaterField.disableCollapse && (values.length > nonCollapsedItems);
    const isCollapsed = sharedRepeatState.isCollapsed;

    const hasChildren = repeaterField.components && repeaterField.components.length > 0;
    const showAdd = repeaterField.allowAddRemove && hasChildren;

    const toggle = () => {
      setSharedRepeatState(state => ({ ...state, isCollapsed: !isCollapsed }));
    };

    const shouldScroll = useRef(false);

    const onAddItem = () => {
      const updatedValues = values.slice();
      const newItem = this._form._getInitializedFieldData(this._form._getState().data, {
        customRoot : repeaterField,
        customIndexes : { ...indexes, [ repeaterField.id ]: updatedValues.length }
      });

      updatedValues.push(newItem);

      shouldScroll.current = true;

      props.onChange({
        field: repeaterField,
        value: updatedValues,
        indexes
      });

      setSharedRepeatState(state => ({ ...state, isCollapsed: false }));
    };

    useScrollIntoView(addButtonRef, [ values.length ], {
      align: 'bottom',
      behavior: 'auto',
      offset: 20
    }, [ shouldScroll ]);

    return <div className="fjs-repeat-render-footer" style={ repeaterField.allowAddRemove ? { marginRight: 32 } : { justifyContent: 'center' } }>
      {
        showAdd ? <button class="fjs-repeat-render-add" ref={ addButtonRef } onClick={ onAddItem }>
          <><AddSvg /> { 'Add new' }</>
        </button> : null
      }
      {
        collapseEnabled ? <button class="fjs-repeat-render-collapse" onClick={ toggle }>
          {
            isCollapsed
              ? <><ExpandSvg /> { `Expand all (${values.length})` }</>
              : <><CollapseSvg /> { 'Collapse' }</>
          }
        </button> : null
      }
    </div>;
  }

  _getNonCollapsedItems(field) {
    const DEFAULT_NON_COLLAPSED_ITEMS = 5;

    const { nonCollapsedItems } = field;

    return nonCollapsedItems ? nonCollapsedItems : DEFAULT_NON_COLLAPSED_ITEMS;
  }

}

RepeatRenderManager.$inject = [ 'form', 'formFields', 'formFieldRegistry', 'pathRegistry' ];