import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useGetLabelCorrelation } from '../../../hooks/useGetLabelCorrelation';
import { useService, useCleanupSingleSelectValue } from '../../../hooks';

import classNames from 'classnames';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';
import { DropdownList } from './DropdownList';

export function SearchableSelect(props) {
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
  const [ isFilterActive, setIsFilterActive ] = useState(true);
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

  const getLabelCorrelation = useGetLabelCorrelation(options);

  const label = useMemo(() => value && getLabelCorrelation(value), [ value, getLabelCorrelation ]);

  // whenever we change the underlying value, set the label to it
  useEffect(() => { setFilter(label || ''); }, [ label ]);

  const filteredOptions = useMemo(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return [];
    }

    if (!filter || !isFilterActive) {
      return options;
    }

    return options.filter((o) => o.label && o.value && (o.label.toLowerCase().includes(filter.toLowerCase())));

  }, [ filter, loadState, options, isFilterActive ]);

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
    setIsFilterActive(true);
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
        setIsFilterActive(false);
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
    setIsFilterActive(false);
  }, []);

  const onInputFocus = useCallback(() => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    onFocus && onFocus();
  }, [ onFocus ]);

  const onInputBlur = useCallback(() => {
    setIsDropdownExpanded(false);
    setFilter(label || '');
    onBlur && onBlur();
  }, [ onBlur, label ]);

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
