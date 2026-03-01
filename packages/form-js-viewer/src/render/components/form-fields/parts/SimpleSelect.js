import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import classNames from 'classnames';
import { findIndex } from 'min-dash';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../../hooks/useCleanupSingleSelectValue';
import { useGetLabelCorrelation } from '../../../hooks/useGetLabelCorrelation';

import XMarkIcon from '../icons/XMark.svg';
import AngelDownIcon from '../icons/AngelDown.svg';
import AngelUpIcon from '../icons/AngelUp.svg';
import { DropdownList } from './DropdownList';

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
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  } = props;

  const { loadState, options } = useOptionsAsync(field);
  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const getLabelCorrelation = useGetLabelCorrelation(options);
  const valueLabel = useMemo(() => value && getLabelCorrelation(value), [value, getLabelCorrelation]);

  const triggerRef = useRef();
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!options || !value) return -1;
    const idx = findIndex(options, (o) => o.value === value);
    return idx != null ? idx : -1;
  });

  const selectedIndex = useMemo(() => {
    if (!value || !options) return -1;
    const idx = findIndex(options, (o) => o.value === value);
    return idx != null ? idx : -1;
  }, [options, value]);

  const listboxId = `${domId}-listbox`;
  const optionDomId = useCallback((i) => `${domId}-option-${i}`, [domId]);

  const componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
  const displayCross = componentReady && value !== null && value !== undefined;
  const displayDropdown = componentReady && isDropdownExpanded;

  // ─── Actions ───

  const pickOption = useCallback(
    (option) => {
      props.onChange({ value: (option && option.value) || null });
    },
    [props],
  );

  const onOptionClick = useCallback(
    (index, option) => {
      pickOption(option);
      setActiveIndex(index);
      setIsDropdownExpanded(false);
      triggerRef.current && triggerRef.current.focus();
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
      e.stopPropagation();
    },
    [pickOption],
  );

  // ─── Focus ───

  const onInputFocus = useCallback(() => {
    if (!readonly) {
      onFocus && onFocus();
    }
  }, [onFocus, readonly]);

  const onInputBlur = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(false);
      onBlur && onBlur();
    }
  }, [onBlur, readonly]);

  // ─── Mouse ───

  const onMouseDown = useCallback(
    (e) => {
      if (disabled || readonly) return;

      e.preventDefault();
      setIsDropdownExpanded((open) => !open);
      triggerRef.current && triggerRef.current.focus();
    },
    [disabled, readonly],
  );

  // ─── Keyboard (virtual focus — stays on trigger) ───

  const onKeyDown = useCallback(
    (e) => {
      if (disabled || readonly) return;

      const { key } = e;

      if (isDropdownExpanded) {
        switch (key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < options.length) {
              onOptionClick(activeIndex, options[activeIndex]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsDropdownExpanded(false);
            break;
          case 'Tab':
            // Allow natural tab but close dropdown and select
            if (activeIndex >= 0 && activeIndex < options.length) {
              pickOption(options[activeIndex]);
            }
            setIsDropdownExpanded(false);
            break;
        }
      } else {
        switch (key) {
          case 'ArrowDown':
          case 'ArrowUp':
          case 'Enter':
          case ' ':
            e.preventDefault();
            setIsDropdownExpanded(true);
            if (selectedIndex >= 0) {
              setActiveIndex(selectedIndex);
            } else {
              setActiveIndex(0);
            }
            break;
        }
      }
    },
    [activeIndex, disabled, isDropdownExpanded, onOptionClick, options, pickOption, readonly, selectedIndex],
  );

  // ─── Render ───

  return (
    <>
      <div
        ref={triggerRef}
        id={domId}
        role="combobox"
        class={classNames('fjs-input-group', { disabled, readonly }, { hasErrors: errors.length })}
        tabIndex={disabled ? undefined : 0}
        aria-controls={listboxId}
        aria-expanded={isDropdownExpanded}
        aria-haspopup="listbox"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-activedescendant={isDropdownExpanded && activeIndex >= 0 ? optionDomId(activeIndex) : undefined}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onFocus={onInputFocus}
        onBlur={onInputBlur}>
        <div class={classNames('fjs-select-display', { 'fjs-select-placeholder': !value })}>
          {valueLabel || 'Select'}
        </div>
        {displayCross && (
          <span class="fjs-select-cross" onMouseDown={onClear}>
            <XMarkIcon />
          </span>
        )}
        <span class="fjs-select-arrow">{displayDropdown ? <AngelUpIcon /> : <AngelDownIcon />}</span>
      </div>
      <div class="fjs-select-anchor">
        {displayDropdown && (
          <DropdownList
            id={listboxId}
            optionDomId={optionDomId}
            values={options}
            getLabel={(option) => option.label}
            activeIndex={activeIndex}
            selectedIndex={selectedIndex}
            onOptionClick={onOptionClick}
            onOptionMouseEnter={onOptionMouseEnter}
          />
        )}
      </div>
    </>
  );
}
