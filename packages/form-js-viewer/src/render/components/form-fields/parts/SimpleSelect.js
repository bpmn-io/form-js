import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../../hooks/useValuesAsync';

import { FormContext } from '../../../context';

import XMarkIcon from './icons/XMark.svg';
import AngelDownIcon from './icons/AngelDown.svg';
import AngelUpIcon from './icons/AngelUp.svg';

import {
  prefixId,
} from '../../Util';

import classNames from 'classnames';

import DropdownList from './DropdownList';

export default function SimpleSelect(props) {
  const {
    id,
    disabled,
    errors = [],
    field,
    value
  } = props;

  const { formId } = useContext(FormContext);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  // We cache a map of option values to their index so that we don't need to search the whole options array every time to correlate the label
  const valueToOptionMap = useMemo(() => Object.assign({}, ...options.map((o, x) => ({ [o.value]: options[x] }))), [options]);

  const valueLabel = useMemo(() => value && valueToOptionMap[value].label || '', [value, valueToOptionMap]);

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null;
    ds.displayDropdown = !disabled && isDropdownExpanded;
    return ds;
  }, [disabled, isDropdownExpanded, loadState, value]);

  const onAngelMouseDown = useCallback((e) => {
    setIsDropdownExpanded(!isDropdownExpanded);

    const searchbar = searchbarRef.current;
    isDropdownExpanded ? searchbar.blur() : searchbar.focus();

    e.preventDefault();

  }, [isDropdownExpanded]);

  return <>
    <div class={classNames('fjs-select', { 'disabled': disabled })}>
      <div class={classNames('fjs-input-group', { 'disabled': disabled }, { 'hasErrors': errors.length })}>
        <input
          disabled={disabled}
          class="fjs-input"
          ref={searchbarRef}
          id={prefixId(`${id}-search`, formId)}
          onChange={onChange}
          type="text"
          value={filter}
          placeholder={'Search'}
          autoComplete="off"
          onKeyDown={(e) => onInputKeyDown(e)}
          onMouseDown={() => { setIsEscapeClose(false); setIsDropdownExpanded(true); }}
          onFocus={() => setIsDropdownExpanded(true)}
          onBlur={() => { setIsDropdownExpanded(false); setFilter(valueLabel); }} />
        {displayState.displayCross && <span class="fjs-select-cross" onClick={() => setValue(null)}><XMarkIcon /> </span>}
        <span class="fjs-select-arrow" onMouseDown={(e) => onAngelMouseDown(e)}>{displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon />}</span>
      </div>
    </div>
    <div class="fjs-select-anchor">
      {displayState.displayDropdown && <DropdownList
        values={filteredOptions}
        getLabel={(o) => o.label}
        onValueSelected={(o) => { setValue(o); setIsDropdownExpanded(false); }}
        listenerElement={searchbarRef.current} />}
    </div>
  </>;
}
