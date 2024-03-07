import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import classNames from 'classnames';
import { findIndex } from 'min-dash';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../../hooks/useCleanupSingleSelectValue';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';
import { DropdownList } from './DropdownList';
import { useService } from '../../../hooks';
import { wrapKeyPressedEvent } from '../../util/keyPressUtil';

export function SearchableSelect(props) {
  const {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    readonly,
    value,
    'aria-labelledby': ariaLabelledById,
    'aria-describedby': ariaDescribedById
  } = props;

  const eventBus = useService('eventBus');
  const { loadState, options } = useOptionsAsync(field);
  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange
  });

  const inputRef = useRef();
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ selectedIndex, setSelectedIndex ] = useState(() =>
    options && value ? findIndex(options, (o) => o.value === value) : -1
  );
  const [ activeIndex, setActiveIndex ] = useState(selectedIndex);
  const [ selectedLabel, setSelectedLabel ] = useState(selectedIndex !== -1 ? options[selectedIndex].label : '');

  const optionDomId = useCallback((i) => `${domId}-option-${i}`, [ domId ]);
  const getOptionLabel = useCallback((o) => o.label, []);

  const componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
  const displayState = {
    componentReady,
    displayCross: componentReady && value !== null && value !== undefined,
    displayDropdown: !disabled && !readonly && isDropdownExpanded
  };
  const [ filter, setFilter ] = useState('');
  const filteredOptions = useMemo(() => {

    if (loadState !== LOAD_STATES.LOADED) {
      return [];
    }

    if (!filter) {
      return options;
    }

    return options.filter(({ label, value }) => label && value && (label.toLowerCase().includes(filter.toLowerCase())));

  }, [ filter, loadState, options ]);

  const setValue = useCallback((index) => {
    setSelectedIndex(index);
    setActiveIndex(index);
    if (index >= 0) {
      const { label, value } = filteredOptions[index];
      setSelectedLabel(label);
      props.onChange({ value, field });
    } else {
      setSelectedLabel('');
      props.onChange({ value: null, field });
    }
  }, [ field, filteredOptions, props ]);

  const onOptionHover = useCallback((i) => {
    setActiveIndex(i);
  }, []);

  const onOptionSelected = useCallback((i, option) => {
    setValue(i);
    inputRef.current.value = option.label;
    setIsDropdownExpanded(false);
  }, [ setValue ]);

  const onInputFocus = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(true);
      setFilter(inputRef.current.value);
      setActiveIndex(0);
      onFocus && onFocus();
    }
  }, [ onFocus, readonly ]);

  const onInputKeyDown = useCallback((ev) => {
    const isKeyPressed = wrapKeyPressedEvent(ev);

    if ([ 'Escape', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown' ].some(isKeyPressed)) {
      ev.preventDefault();
    }

    if (disabled || readonly) {
      return;
    }
    if (isDropdownExpanded) {
      if (isKeyPressed('Escape')) {
        setIsDropdownExpanded(false);
      }
      if (isKeyPressed('ArrowDown')) {
        if (activeIndex + 1 < options.length) {
          setActiveIndex(activeIndex => activeIndex + 1);
        }
      }
      if (isKeyPressed('ArrowUp')) {
        if (activeIndex > 0) {
          setActiveIndex(activeIndex => activeIndex - 1);
        }
      }
      if ([ 'Tab', 'Enter' ].some(isKeyPressed) || isKeyPressed('ArrowUp', { altKey: true })) {
        onOptionSelected(activeIndex, filteredOptions[activeIndex]);
      }
      if (isKeyPressed('Home')) {
        setActiveIndex(0);
      }
      if (isKeyPressed('End')) {
        setActiveIndex(filteredOptions.length - 1);
      }
      if (isKeyPressed('PageUp')) {
        if (activeIndex > 10) {
          setActiveIndex(activeIndex - 10);
        } else {
          setActiveIndex(0);
        }
      }
      if (isKeyPressed('PageDown')) {
        if (activeIndex + 10 < filteredOptions.length) {
          setActiveIndex(activeIndex + 10);
        } else {
          setActiveIndex(filteredOptions.length - 1);
        }
      }
    } else {
      if ([ 'ArrowUp', 'Home' ].some(isKeyPressed)) {
        setActiveIndex(0);
        setIsDropdownExpanded(true);
      }
      if (isKeyPressed('End')) {
        setActiveIndex(filteredOptions.length);
        setIsDropdownExpanded(true);
      }
      if ([ 'ArrowDown', 'Enter', ' ' ].some(isKeyPressed)) {
        setIsDropdownExpanded(true);
      }
    }
  }, [ activeIndex, disabled, filteredOptions, isDropdownExpanded, onOptionSelected, options.length, readonly ]);

  const onInputMouseDown = useCallback((ev) => {
    if (disabled || readonly) {
      return;
    }

    setIsDropdownExpanded(!isDropdownExpanded);
    if (!isDropdownExpanded) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [ disabled, isDropdownExpanded, readonly ]);

  const onAngelMouseDown = useCallback((ev) => {
    ev.preventDefault();
    onInputMouseDown(ev);
  }, [ onInputMouseDown ]);

  const onInputBlur = useCallback((ev) => {
    if (disabled || readonly) {
      return;
    }

    inputRef.current.value = selectedLabel;
    setIsDropdownExpanded(false);
    onBlur && onBlur();
  }, [ disabled, onBlur, readonly, selectedLabel ]);

  const onInputChange = useCallback(({ target }) => {
    setIsDropdownExpanded(true);
    setFilter(target.value || '');
    setActiveIndex(0);
    eventBus.fire('formField.search', { formField: field, value: target.value || '' });
  }, [ eventBus, field ]);

  const onClear = useCallback(() => {
    setValue(-1);
    setActiveIndex(-1);
    setFilter('');
    inputRef.current.value = null;
  }, [ setValue ]);

  return <>
    <div
      role="combobox"
      class={ classNames('fjs-input-group', { disabled, readonly }, { 'hasErrors': errors.length }) }
    >
      <input
        ref={ inputRef }
        id={ domId }
        disabled={ disabled }
        readOnly={ readonly }
        class="fjs-input"
        tabIndex={ 0 }
        type="text"
        placeholder="Search"
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={ `${domId}-listbox` }
        aria-expanded={ isDropdownExpanded }
        aria-haspopup="listbox"
        aria-labelledby={ ariaLabelledById }
        aria-describedby={ ariaDescribedById }
        aria-activedescendant={ activeIndex >= 0 ? optionDomId(activeIndex) : undefined }
        onChange={ onInputChange }
        onKeyDown={ onInputKeyDown }
        onMouseDown={ onInputMouseDown }
        onFocus={ onInputFocus }
        onBlur={ onInputBlur } />

      {(!disabled && !readonly && value) &&
      <span
        role="button"
        aria-hidden
        class="fjs-select-cross"
        onClick={ onClear }
        onMouseDown={ (ev) => { ev.stopPropagation(); } }>
        <XMarkIcon role="presentation" />
      </span>}
      <span
        role="presentation"
        class="fjs-select-arrow"
        onMouseDown={ onAngelMouseDown }
      >
        { displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon /> }
      </span>
    </div>

    <div class="fjs-select-anchor">
      <DropdownList
        id={ `${domId}-listbox` }
        optionDomId={ optionDomId }
        values={ filteredOptions }
        hidden={ !displayState.displayDropdown }
        getLabel={ getOptionLabel }
        selectedIndex={ selectedIndex }
        activeIndex={ activeIndex }
        onClick={ onOptionSelected }
        onHover={ onOptionHover }
      />
    </div>
  </>;
}