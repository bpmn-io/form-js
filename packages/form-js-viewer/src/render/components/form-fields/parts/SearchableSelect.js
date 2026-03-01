import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useGetLabelCorrelation } from '../../../hooks/useGetLabelCorrelation';
import { useService, useCleanupSingleSelectValue, useDropdownKeyboardNavigation } from '../../../hooks';
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

  // ─── Selected index tracking (within filteredOptions) ───

  const selectedIndexInFiltered = useMemo(() => {
    if (!value || !filteredOptions.length) return -1;
    const idx = findIndex(filteredOptions, (o) => o.value === value);
    return idx != null ? /** @type {number} */ (idx) : -1;
  }, [filteredOptions, value]);

  const listboxId = `${domId}-listbox`;
  const optionDomId = useCallback((i) => `${domId}-option-${i}`, [domId]);

  const componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
  const displayCross = componentReady && value !== null && value !== undefined;

  // ─── Actions ───

  const pickOption = useCallback(
    (option) => {
      setFilter((option && option.label) || '');
      props.onChange({ value: (option && option.value) || null });
    },
    [props],
  );

  const onSelect = useCallback(
    (index, option) => {
      pickOption(option);
      setIsDropdownExpanded(false);
    },
    [pickOption],
  );

  // ─── Shared keyboard hook ───

  const { activeIndex, setActiveIndex, onKeyDown: hookKeyDown } = useDropdownKeyboardNavigation({
    options: filteredOptions,
    isDropdownExpanded,
    setIsDropdownExpanded,
    selectedIndex: selectedIndexInFiltered,
    onSelect,
    onClose: useCallback(() => {
      setFilter(selectedLabel || '');
    }, [selectedLabel]),
    onOpen: useCallback(() => {
      setIsFilterActive(false);
    }, []),
    spaceSelects: false,
  });

  const displayDropdown = componentReady && isDropdownExpanded;

  // ─── Event handlers ───

  const onOptionClick = useCallback(
    (index, option) => {
      pickOption(option);
      setActiveIndex(index);
      setIsDropdownExpanded(false);
    },
    [pickOption, setActiveIndex],
  );

  const onOptionMouseEnter = useCallback(
    (index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const onClear = useCallback(
    (e) => {
      pickOption(null);
      setActiveIndex(-1);
      setFilter('');
      setIsFilterActive(false);
      e.preventDefault();
    },
    [pickOption, setActiveIndex],
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
    [eventBus, field, setActiveIndex],
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

  const onInputKeyDown = useCallback(
    (e) => {
      if (disabled || readonly) return;
      hookKeyDown(e);
    },
    [disabled, readonly, hookKeyDown],
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
