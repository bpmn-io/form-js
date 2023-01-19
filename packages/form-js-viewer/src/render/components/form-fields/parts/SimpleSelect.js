import { useCallback, useContext, useMemo, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../../hooks/useValuesAsync';

import { FormContext } from '../../../context';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';

import {
  prefixId,
} from '../../Util';

import classNames from 'classnames';

import DropdownList from './DropdownList';
import { findIndex } from 'min-dash';

export default function SimpleSelect(props) {
  const {
    id,
    disabled,
    errors,
    field,
    value
  } = props;

  const { formId } = useContext(FormContext);
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const selectRef = useRef();

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  // We cache a map of option values to their index so that we don't need to search the whole options array every time to correlate the label
  const valueToOptionMap = useMemo(() => Object.assign({}, ...options.map((o, x) => ({ [o.value]: options[x] }))), [ options ]);

  const valueLabel = useMemo(() => value && valueToOptionMap[ value ]?.label || '', [ value, valueToOptionMap ]);

  const setValue = useCallback((option) => {
    props.onChange({ value: option?.value || null, field });
  }, [ field, props ]);

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null;
    ds.displayDropdown = !disabled && isDropdownExpanded;
    return ds;
  }, [ disabled, isDropdownExpanded, loadState, value ]);

  const onMouseDown = useCallback((e) => {
    const select = selectRef.current;
    setIsDropdownExpanded(!isDropdownExpanded);
    isDropdownExpanded ? select.blur() : select.focus();
    e.preventDefault();
  }, [ isDropdownExpanded ]);

  const initialFocusIndex = useMemo(() => value && findIndex(options, (o) => o.value === value) || 0, [ options, value ]);

  return <>
    <div ref={ selectRef }
      class={ classNames('fjs-input-group', { 'disabled': disabled }, { 'hasErrors': errors.length }) }
      onFocus={ () => setIsDropdownExpanded(true) }
      onBlur={ () => setIsDropdownExpanded(false) }
      onMouseDown={ (e) => onMouseDown(e) }
      tabIndex={ disabled ? null : 0 }>
      <div class={ classNames('fjs-select-display', { 'fjs-select-placeholder' : !value }) } id={ prefixId(`${id}-display`, formId) }>{ valueLabel || 'Select' }</div>
      { displayState.displayCross && <span class="fjs-select-cross" onMouseDown={ (e) => { setValue(null); e.preventDefault(); } }><XMarkIcon /></span> }
      <span class="fjs-select-arrow">{ displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon /> }</span>
    </div>
    <div class="fjs-select-anchor">
      {displayState.displayDropdown && <DropdownList
        values={ options }
        getLabel={ (o) => o.label }
        initialFocusIndex={ initialFocusIndex }
        onValueSelected={ (o) => { setValue(o); setIsDropdownExpanded(false); } }
        keyEventsListener={ selectRef.current } />}
    </div>
  </>;
}
