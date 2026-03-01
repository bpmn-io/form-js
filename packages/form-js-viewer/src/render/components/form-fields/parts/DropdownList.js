import classNames from 'classnames';
import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import { useKeyDownAction } from '../../../hooks/useKeyDownAction';

const DEFAULT_LABEL_GETTER = (value) => value;
const NOOP = () => {};
const DEFAULT_OPTION_ID = (i) => `fjs-dropdownlist-option-${i}`;

/**
 * DropdownList can operate in two modes:
 *
 * **Legacy (self-managed keyboard):** Pass `listenerElement`, `onValueSelected`,
 * and optionally `initialFocusIndex`. The component attaches its own keyboard
 * listeners and manages focused-index state internally. Used by Taglist & Timepicker.
 *
 * **Controlled (parent-managed keyboard / virtual focus):** Pass `activeIndex`,
 * `selectedIndex`, `onOptionClick`, `onOptionMouseEnter`, and optionally `id` /
 * `optionDomId`. The component is purely presentational — the parent owns all
 * state and keyboard handling.  Used by SimpleSelect & SearchableSelect.
 */
export function DropdownList(props) {
  const {
    values = [],
    getLabel = DEFAULT_LABEL_GETTER,
    height = 235,
    emptyListMessage = 'No results',

    // --- Controlled-mode (new) props ---
    id,
    optionDomId = DEFAULT_OPTION_ID,
    activeIndex,
    selectedIndex,
    onOptionClick,
    onOptionMouseEnter,

    // --- Legacy-mode props ---
    listenerElement,
    onValueSelected = NOOP,
    initialFocusIndex = 0,
  } = props;

  const isControlled = activeIndex !== undefined;

  // ─── Legacy-mode state (only used when not controlled) ───

  const [mouseControl, setMouseControl] = useState(false);
  const [focusedValueIndex, setFocusedValueIndex] = useState(initialFocusIndex);

  /** @type {import("preact").RefObject<{ x: number, y: number }>} */
  const mouseScreenPos = useRef();

  const focusedItem = useMemo(
    () => (values.length ? values[focusedValueIndex] : null),
    [focusedValueIndex, values],
  );

  const changeFocusedValueIndex = useCallback(
    (delta) => {
      setFocusedValueIndex((x) => Math.min(Math.max(0, x + delta), values.length - 1));
    },
    [values.length],
  );

  useEffect(() => {
    if (isControlled) return;
    if (focusedValueIndex === 0) return;

    if (!focusedValueIndex || !values.length) {
      setFocusedValueIndex(0);
    } else if (focusedValueIndex >= values.length) {
      setFocusedValueIndex(values.length - 1);
    }
  }, [isControlled, focusedValueIndex, values.length]);

  useKeyDownAction(
    'ArrowUp',
    () => {
      if (!isControlled && values.length) {
        changeFocusedValueIndex(-1);
        setMouseControl(false);
      }
    },
    listenerElement || window,
  );

  useKeyDownAction(
    'ArrowDown',
    () => {
      if (!isControlled && values.length) {
        changeFocusedValueIndex(1);
        setMouseControl(false);
      }
    },
    listenerElement || window,
  );

  useKeyDownAction(
    'Enter',
    () => {
      if (!isControlled && focusedItem) {
        onValueSelected(focusedItem);
      }
    },
    listenerElement || window,
  );

  const onMouseMovedInKeyboardMode = (event, valueIndex) => {
    const userMovedCursor =
      !mouseScreenPos.current ||
      (mouseScreenPos.current.x !== event.screenX && mouseScreenPos.current.y !== event.screenY);

    if (userMovedCursor) {
      mouseScreenPos.current = { x: event.screenX, y: event.screenY };
      setMouseControl(true);
      setFocusedValueIndex(valueIndex);
    }
  };

  // ─── Shared ───

  const [smoothScrolling, setSmoothScrolling] = useState(false);

  /** @type {import("preact").RefObject<HTMLDivElement>} */
  const dropdownContainer = useRef();

  const effectiveFocusIndex = isControlled ? activeIndex : focusedValueIndex;

  useEffect(() => {
    const container = dropdownContainer.current;
    if (!container) return;
    const children = container.children;
    if (children.length && (isControlled || !mouseControl)) {
      const focusedEntry = children[effectiveFocusIndex];
      focusedEntry && focusedEntry.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [effectiveFocusIndex, isControlled, mouseControl]);

  useEffect(() => {
    setSmoothScrolling(true);
  }, []);

  // ─── Render ───

  return (
    <div
      ref={dropdownContainer}
      id={id}
      role="listbox"
      tabIndex={-1}
      class="fjs-dropdownlist"
      onMouseDown={(e) => e.preventDefault()}
      style={{ maxHeight: height, scrollBehavior: smoothScrolling ? 'smooth' : 'auto' }}>
      {values.length > 0 &&
        values.map((entry, index) => {
          const isFocused = effectiveFocusIndex === index;
          const isSelected = isControlled ? selectedIndex === index : false;

          // In controlled mode, use simple onMouseEnter/onMouseDown.
          // In legacy mode, use the old mouse-tracking approach.
          const mouseProps = isControlled
            ? {
                onMouseEnter: () => onOptionMouseEnter && onOptionMouseEnter(index, entry),
                onMouseDown: () => onOptionClick && onOptionClick(index, entry),
              }
            : {
                onMouseMove: mouseControl ? undefined : (e) => onMouseMovedInKeyboardMode(e, index),
                onMouseEnter: mouseControl ? () => setFocusedValueIndex(index) : undefined,
                onMouseDown: () => onValueSelected(entry),
              };

          return (
            <div
              key={entry.value}
              id={isControlled ? optionDomId(index) : undefined}
              role="option"
              aria-selected={isSelected}
              class={classNames('fjs-dropdownlist-item', { focused: isFocused })}
              {...mouseProps}>
              {getLabel(entry)}
            </div>
          );
        })}
      {!values.length && <div class="fjs-dropdownlist-empty">{emptyListMessage}</div>}
    </div>
  );
}
