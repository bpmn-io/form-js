import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useGetLabelCorrelation } from '../../../hooks/useGetLabelCorrelation';
import { useService, useCleanupSingleSelectValue } from '../../../hooks';
import { findIndex } from 'min-dash';

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
    value,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  } = props;

  /** @type {import("preact").RefObject<HTMLInputElement>} */
  const inputRef = useRef();
  const eventBus = useService('eventBus');

  const { loadState, options } = useOptionsAsync(field);
  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const getLabelCorrelation = useGetLabelCorrelation(options);
  const selectedLabel = useMemo(() => value && getLabelCorrelation(value), [value, getLabelCorrelation]);

  // ─── Filter state ───

  const [filter, setFilter] = useState('');
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true);

  // Sync the input text when the underlying value changes externally
  useEffect(() => {
    setFilter(selectedLabel || '');
  }, [selectedLabel]);

  const filteredOptions = useMemo(() => {
    if (loadState !== LOAD_STATES.LOADED) {
      return [];
    }

    if (!filter || !isFilterActive) {
      return options;
    }

    return options.filter(
      (option) => option.label && option.value && option.label.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [filter, loadState, options, isFilterActive]);

  // ─── Active / selected index tracking (within filteredOptions) ───

  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndexInFiltered = useMemo(() => {
    if (!value || !filteredOptions.length) return -1;
    const idx = findIndex(filteredOptions, (o) => o.value === value);
    return idx != null ? /** @type {number} */ (idx) : -1;
  }, [filteredOptions, value]);

  const listboxId = `${domId}-listbox`;
  const optionDomId = useCallback((i) => `${domId}-option-${i}`, [domId]);

  const componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
  const displayCross = componentReady && value !== null && value !== undefined;
  const displayDropdown = componentReady && isDropdownExpanded;

  // ─── Actions ───

  const pickOption = useCallback(
    (option) => {
      setFilter((option && option.label) || '');
      props.onChange({ value: (option && option.value) || null });
    },
    [props],
  );

  const onOptionClick = useCallback(
    (index, option) => {
      pickOption(option);
      setActiveIndex(index);
      setIsDropdownExpanded(false);
    },
    [pickOption],
  );

  const onOptionMouseEnter = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const onClear = useCallback(
    (e) => {
      pickOption(null);
      setActiveIndex(-1);
      setFilter('');
      setIsFilterActive(false);
      e.preventDefault();
    },
    [pickOption],
  );

  // ─── Input events ───

  const onInputChange = useCallback(
    ({ target }) => {
      setIsDropdownExpanded(true);
      setIsFilterActive(true);
      setActiveIndex(0);
      setFilter(target.value || '');
      eventBus.fire('formField.search', { formField: field, value: target.value || '' });
    },
    [eventBus, field],
  );

  const onInputFocus = useCallback(() => {
    setIsDropdownExpanded(true);
    setIsFilterActive(false);
    onFocus && onFocus();
  }, [onFocus]);

  const onInputBlur = useCallback(() => {
    setIsDropdownExpanded(false);
    setFilter(selectedLabel || '');
    onBlur && onBlur();
  }, [onBlur, selectedLabel]);

  const onInputMouseDown = useCallback(() => {
    setIsDropdownExpanded(true);
    setIsFilterActive(false);
  }, []);

  // ─── Keyboard (virtual focus — stays on input) ───

  const onInputKeyDown = useCallback(
    (e) => {
      if (disabled || readonly) return;

      const { key } = e;

      if (isDropdownExpanded) {
        switch (key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            break;
          case 'Enter':
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
              onOptionClick(activeIndex, filteredOptions[activeIndex]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsDropdownExpanded(false);
            setFilter(selectedLabel || '');
            break;
          case 'Tab':
            // Allow natural tab, select current if highlighted
            if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
              pickOption(filteredOptions[activeIndex]);
            }
            setIsDropdownExpanded(false);
            break;
        }
      } else {
        switch (key) {
          case 'ArrowDown':
          case 'ArrowUp':
            e.preventDefault();
            setIsDropdownExpanded(true);
            setIsFilterActive(false);
            if (selectedIndexInFiltered >= 0) {
              setActiveIndex(selectedIndexInFiltered);
            } else {
              setActiveIndex(0);
            }
            break;
        }
      }
    },
    [activeIndex, disabled, filteredOptions, isDropdownExpanded, onOptionClick, pickOption, readonly, selectedIndexInFiltered, selectedLabel],
  );

  // ─── Arrow toggle ───

  const onAngelMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      if (disabled || readonly) return;

      setIsDropdownExpanded((open) => {
        if (!open) {
          inputRef.current && inputRef.current.focus();
        }
        return !open;
      });
      setIsFilterActive(false);
    },
    [disabled, readonly],
  );

  // ─── Render ───

  return (
    <>
      <div
        role="combobox"
        aria-expanded={isDropdownExpanded}
        aria-haspopup="listbox"
        aria-owns={listboxId}
        class={classNames('fjs-input-group', { disabled, readonly }, { hasErrors: errors.length })}>
        <input
          ref={inputRef}
          id={domId}
          disabled={disabled}
          readOnly={readonly}
          class="fjs-input"
          type="text"
          value={filter}
          placeholder="Search"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-activedescendant={isDropdownExpanded && activeIndex >= 0 ? optionDomId(activeIndex) : undefined}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        {displayCross && (
          <span class="fjs-select-cross" onMouseDown={onClear}>
            <XMarkIcon />
          </span>
        )}
        <span class="fjs-select-arrow" onMouseDown={onAngelMouseDown}>
          {displayDropdown ? <AngelUpIcon /> : <AngelDownIcon />}
        </span>
      </div>
      <div class="fjs-select-anchor">
        {displayDropdown && (
          <DropdownList
            id={listboxId}
            optionDomId={optionDomId}
            values={filteredOptions}
            getLabel={(option) => option.label}
            activeIndex={activeIndex}
            selectedIndex={selectedIndexInFiltered}
            onOptionClick={onOptionClick}
            onOptionMouseEnter={onOptionMouseEnter}
          />
        )}
      </div>
    </>
  );
}
