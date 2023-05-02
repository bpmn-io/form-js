import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
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

export default function SearchableSelect(props) {
  const {
    id,
    disabled,
    errors,
    field,
    readonly,
    value
  } = props;

  const { formId } = useContext(FormContext);
  const [ filter, setFilter ] = useState('');
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ shouldApplyFilter, setShouldApplyFilter ] = useState(true);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const searchbarRef = useRef();

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  // We cache a map of option values to their index so that we don't need to search the whole options array every time to correlate the label
  const valueToOptionMap = useMemo(() => Object.assign({}, ...options.map((o, x) => ({ [o.value]: options[x] }))), [ options ]);

  const valueLabel = useMemo(() => value && valueToOptionMap[value] && valueToOptionMap[value].label || '', [ value, valueToOptionMap ]);

  // whenever we change the underlying value, set the label to it
  useEffect(() => { setFilter(valueLabel); }, [ valueLabel ]);

  const filteredOptions = useMemo(() => {

    if (loadState === LOAD_STATES.LOADED) {
      return shouldApplyFilter ? options.filter((o) => o.label && o.value && (o.label.toLowerCase().includes(filter.toLowerCase()))) : options;
    }

    return [];

  }, [ filter, loadState, options, shouldApplyFilter ]);

  const onChange = ({ target }) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setShouldApplyFilter(true);
    setFilter(target.value || '');
  };

  const setValue = useCallback((option) => {
    setFilter(option && option.label || '');
    props.onChange({ value: option && option.value || null, field });
  }, [ field, props ]);

  const onInputKeyDown = useCallback((keyDownEvent) => {

    switch (keyDownEvent.key) {
    case 'ArrowUp':
      keyDownEvent.preventDefault();
      break;
    case 'ArrowDown': {
      if (!isDropdownExpanded) {
        setIsDropdownExpanded(true);
        setShouldApplyFilter(false);
      }

      keyDownEvent.preventDefault();
      break;
    }
    case 'Escape':
      setIsEscapeClose(true);
      break;
    case 'Enter':
      if (isEscapeClosed) {
        setIsEscapeClose(false);
      }
      break;
    }
  }, [ isDropdownExpanded, isEscapeClosed ]);

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null && value !== undefined;
    ds.displayDropdown = !disabled && !readonly && isDropdownExpanded && !isEscapeClosed;
    return ds;
  }, [ disabled, isDropdownExpanded, isEscapeClosed, loadState, readonly, value ]);

  const onAngelMouseDown = useCallback((e) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(!isDropdownExpanded);

    const searchbar = searchbarRef.current;
    isDropdownExpanded ? searchbar.blur() : searchbar.focus();

    e.preventDefault();

  }, [ isDropdownExpanded ]);

  return <>
    <div id={ prefixId(`${id}`, formId) }
      class={ classNames('fjs-input-group', { 'disabled': disabled, 'readonly': readonly }, { 'hasErrors': errors.length }) }>
      <input
        disabled={ disabled }
        readOnly={ readonly }
        class="fjs-input"
        ref={ searchbarRef }
        id={ prefixId(`${id}-search`, formId) }
        onChange={ onChange }
        type="text"
        value={ filter }
        placeholder={ 'Search' }
        autoComplete="off"
        onKeyDown={ (e) => onInputKeyDown(e) }
        onMouseDown={ () => { setIsEscapeClose(false); setIsDropdownExpanded(true); setShouldApplyFilter(false); } }
        onFocus={ () => { setIsDropdownExpanded(true); setShouldApplyFilter(false); } }
        onBlur={ () => { setIsDropdownExpanded(false); setFilter(valueLabel); } }
        aria-describedby={ props['aria-describedby'] } />
      { displayState.displayCross && <span class="fjs-select-cross" onMouseDown={ (e) => { setValue(null); e.preventDefault(); } }><XMarkIcon /> </span> }
      <span class="fjs-select-arrow" onMouseDown={ (e) => onAngelMouseDown(e) }>{ displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon /> }</span>
    </div>
    <div class="fjs-select-anchor">
      { displayState.displayDropdown && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => { setValue(o); setIsDropdownExpanded(false); } }
        listenerElement={ searchbarRef.current } />}
    </div>
  </>;
}
