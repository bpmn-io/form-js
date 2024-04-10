import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import classNames from 'classnames';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../../hooks/useCleanupSingleSelectValue';
import { wrapKeyPressedEvent } from '../../util/keyPressUtil';
import { useLookUpTable } from '../../../hooks/useLookUpTable';
import { DropdownList } from './DropdownList';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';

export function SimpleSelect(props) {
  const {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    readonly,
    value,
    'aria-labelledby': ariaLabelledById
  } = props;

  const useNative = useMemo(() => !window.matchMedia('(any-pointer:fine)').matches, []);

  const { loadState, options } = useOptionsAsync(field);
  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange
  });
  const optionsLut = useLookUpTable(options, (o) => o.value, (o, i) => ({ index: i, label: o.label }));
  const indexFromValue = (value, defaultValue = -1) => optionsLut(value, { index: defaultValue }).index;
  const labelFromValue = (value, defaultValue = undefined) => optionsLut(value, { label: defaultValue }).label;

  const optionDomId = useCallback((i) => `${domId}-option-${i}`, [ domId ]);
  const getOptionLabel = useCallback((o) => o.label, []);

  const inputRef = useRef();
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ selectedIndex, setSelectedIndex ] = useState(() => options && value ? indexFromValue(value, -1) : -1);
  const [ activeIndex, setActiveIndex ] = useState(selectedIndex);

  const setValue = useCallback((index, value) => {
    setSelectedIndex(index);
    setActiveIndex(index);
    props.onChange({ value: value || null, field });
  }, [ field, props ]);

  const componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
  const displayState = {
    componentReady,
    displayCross: componentReady && value !== null && value !== undefined,
    displayDropdown: !disabled && !readonly && isDropdownExpanded
  };

  const onOptionHover = useCallback((i) => {
    setActiveIndex(i);
  }, []);

  const onOptionSelected = useCallback((i, option) => {
    setValue(i, option.value);
    setIsDropdownExpanded(false);
  }, [ setValue ]);

  const onInputFocus = useCallback(() => {
    if (!readonly) {
      onFocus && onFocus();
    }
  }, [ onFocus, readonly ]);

  const onInputKeyDown = useCallback((ev) => {
    if (disabled || readonly) {
      return;
    }
    const isKeyPressed = wrapKeyPressedEvent(ev);

    if (!isKeyPressed('Tab')) {
      ev.preventDefault();
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
      if ([ 'Tab', 'Enter', ' ' ].some(isKeyPressed) || isKeyPressed('ArrowUp', { altKey: true })) {
        onOptionSelected(activeIndex, options[activeIndex]);
      }
      if (isKeyPressed('Home')) {
        setActiveIndex(0);
      }
      if (isKeyPressed('End')) {
        setActiveIndex(options.length - 1);
      }
      if (isKeyPressed('PageUp')) {
        if (activeIndex > 10) {
          setActiveIndex(activeIndex - 10);
        } else {
          setActiveIndex(0);
        }
      }
      if (isKeyPressed('PageDown')) {
        if (activeIndex + 10 < options.length) {
          setActiveIndex(activeIndex + 10);
        } else {
          setActiveIndex(options.length - 1);
        }
      }
    } else {
      if ([ 'ArrowUp', 'Home' ].some(isKeyPressed)) {
        setActiveIndex(0);
        setIsDropdownExpanded(true);
      }
      if (isKeyPressed('End')) {
        setActiveIndex(options.length);
        setIsDropdownExpanded(true);
      }
      if ([ 'ArrowDown', 'Enter', ' ' ].some(isKeyPressed)) {
        setIsDropdownExpanded(true);
      }
    }
  }, [ activeIndex, disabled, isDropdownExpanded, onOptionSelected, options, readonly ]);

  const onInputMouseDown = useCallback((ev) => {
    if (disabled || readonly) {
      return;
    }

    if (ev.button === 0) {
      ev.preventDefault();
      setIsDropdownExpanded(!isDropdownExpanded);
      if (!isDropdownExpanded) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [ disabled, isDropdownExpanded, readonly ]);

  const onInputBlur = useCallback((ev) => {
    ev.preventDefault();
    if (disabled || readonly) {
      return;
    }

    setIsDropdownExpanded(false);
    onBlur && onBlur();
  }, [ disabled, onBlur, readonly ]);

  const onClear = useCallback((ev) => {
    if (ev.button == 0) {
      ev.preventDefault();
      ev.stopPropagation();
      setValue(-1, undefined);
      setActiveIndex(-1);
    }
  }, [ setValue ]);

  if (useNative) {
    return <>
      <select
        id={ `${domId}-native` }
        class="fjs-native-dropdownlist"
        aria-labelledby={ ariaLabelledById }
        size={ 1 }
        onChange={ (ev) => {

          // @ts-expect-error Target should be an HTMLSelectElement
          const value = ev.target.value;
          const selected = indexFromValue(value);
          setValue(selected, value);
        } }>
        <option value="" disabled selected={ activeIndex === -1 } hidden>Select</option>
        {options.map((option, i) => {
          return <option
            key={ option.value }
            data-index={ i }
            value={ option.value }
            selected={ value === option.value }>
            {labelFromValue(option.value)}
          </option>;
        })}
      </select>
    </>;
  } else {
    return <>
      <div
        ref={ inputRef }
        role="combobox"
        id={ domId }
        class={ classNames(
          'fjs-input-group',
          { disabled, readonly, 'hasErrors': errors.length })
        }
        aria-controls={ `${domId}-listbox` }
        aria-expanded={ isDropdownExpanded }
        aria-haspopup="listbox"
        aria-labelledby={ ariaLabelledById }
        aria-activedescendant={ activeIndex >= 0 ? optionDomId(activeIndex) : undefined }
        tabIndex={ 0 }
        onKeyDown={ onInputKeyDown }
        onMouseDown={ onInputMouseDown }
        onFocus={ onInputFocus }
        onBlur={ onInputBlur }
      >
        <div class={ classNames('fjs-select-display', { 'fjs-select-placeholder': selectedIndex === -1 }) }>
          {selectedIndex === -1 ? 'Select' : labelFromValue(value, '')}
        </div>
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
          class="fjs-select-arrow">
          { displayState.displayDropdown ? <AngelUpIcon role="presentation" /> : <AngelDownIcon role="presentation" /> }
        </span>
      </div>

      <div class="fjs-select-anchor">
        <DropdownList
          id={ `${domId}-listbox` }
          optionDomId={ optionDomId }
          values={ options }
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
}
