import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import useOptionsAsync, { LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useService } from '../../../hooks';
import useCleanupSingleSelectValue from '../../../hooks/useCleanupSingleSelectValue';

import classNames from 'classnames';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';
import DropdownList from './DropdownList';

export default function SearchableSelect(props) {
  const {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    readonly,
    value
  } = props;

  const [ filter, setFilter ] = useState('');
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ shouldApplyFilter, setShouldApplyFilter ] = useState(true);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const searchbarRef = useRef();
  const eventBus = useService('eventBus');

  const {
    loadState,
    options
  } = useOptionsAsync(field);

  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange
  });

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

  const setValue = useCallback((option) => {
    setFilter(option && option.label || '');
    props.onChange({ value: option && option.value || null, field });
  }, [ field, props ]);

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

  const onInputChange = ({ target }) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setShouldApplyFilter(true);
    setFilter(target.value || '');
    eventBus.fire('formField.search', { formField: field, value: target.value || '' });
  };

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

  const onInputMouseDown = useCallback(() => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setShouldApplyFilter(false);
  }, []);

  const onInputFocus = useCallback(() => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    onFocus && onFocus();
  }, [ onFocus ]);

  const onInputBlur = useCallback(() => {
    setIsDropdownExpanded(false);
    setFilter(valueLabel);
    onBlur && onBlur();
  }, [ onBlur, valueLabel ]);

  return <>
    <div
      class={ classNames('fjs-input-group', { 'disabled': disabled, 'readonly': readonly }, { 'hasErrors': errors.length }) }>
      <input
        disabled={ disabled }
        readOnly={ readonly }
        class="fjs-input"
        ref={ searchbarRef }
        id={ domId }
        onChange={ onInputChange }
        type="text"
        value={ filter }
        placeholder={ 'Search' }
        autoComplete="off"
        onKeyDown={ onInputKeyDown }
        onMouseDown={ onInputMouseDown }
        onFocus={ onInputFocus }
        onBlur={ onInputBlur }
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
