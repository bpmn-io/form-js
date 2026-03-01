import { useCallback, useState } from 'preact/hooks';

/**
 * @typedef {Object} UseDropdownKeyboardNavigationConfig
 * @property {Array} options - The list of options currently visible in the dropdown.
 * @property {boolean} isDropdownExpanded - Whether the dropdown is currently open.
 * @property {(open: boolean) => void} setIsDropdownExpanded - Toggle the dropdown open/closed.
 * @property {number} selectedIndex - Index of the currently selected option in `options` (-1 if none).
 * @property {(index: number, option: any) => void} onSelect - Called when an option is confirmed (Enter, Space, Alt+Up, Tab).
 * @property {() => void} [onClose] - Called when the dropdown is closed via Escape.
 * @property {() => void} [onOpen] - Called when the dropdown opens via keyboard (e.g. to reset filter state).
 * @property {boolean} [spaceSelects=false] - Whether Space confirms the active option (true for non-editable triggers).
 */

/**
 * Shared keyboard navigation logic for combobox-style dropdowns.
 *
 * Owns `activeIndex` state and returns an `onKeyDown` handler that implements
 * the WAI-ARIA combobox keyboard interaction pattern:
 *
 * - ArrowDown/Up: move active index
 * - Home/End: jump to first/last
 * - PageUp/PageDown: jump ±10
 * - Enter (and optionally Space): select active option
 * - Alt+ArrowUp: select + close
 * - Tab: select + allow natural focus move
 * - Escape: close
 *
 * @param {UseDropdownKeyboardNavigationConfig} config
 * @returns {{ activeIndex: number, setActiveIndex: (v: number | ((i: number) => number)) => void, onKeyDown: (e: KeyboardEvent) => void }}
 */
export function useDropdownKeyboardNavigation({
  options,
  isDropdownExpanded,
  setIsDropdownExpanded,
  selectedIndex,
  onSelect,
  onClose,
  onOpen,
  spaceSelects = false,
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectActive = useCallback(
    () => {
      if (activeIndex >= 0 && activeIndex < options.length) {
        onSelect(activeIndex, options[activeIndex]);
      }
    },
    [activeIndex, onSelect, options],
  );

  const openDropdown = useCallback(
    (initialIndex) => {
      setIsDropdownExpanded(true);
      onOpen && onOpen();
      setActiveIndex(initialIndex);
    },
    [onOpen, setIsDropdownExpanded],
  );

  const defaultOpenIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const onKeyDown = useCallback(
    (e) => {
      const { key, altKey } = e;

      if (isDropdownExpanded) {
        switch (key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (altKey) {
              selectActive();
              setIsDropdownExpanded(false);
            } else {
              setActiveIndex((i) => Math.max(i - 1, 0));
            }
            break;
          case 'Home':
            e.preventDefault();
            setActiveIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setActiveIndex(options.length - 1);
            break;
          case 'PageUp':
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 10, 0));
            break;
          case 'PageDown':
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 10, options.length - 1));
            break;
          case 'Enter':
            e.preventDefault();
            selectActive();
            break;
          case ' ':
            if (spaceSelects) {
              e.preventDefault();
              selectActive();
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsDropdownExpanded(false);
            onClose && onClose();
            break;
          case 'Tab':
            selectActive();
            setIsDropdownExpanded(false);
            break;
        }
      } else {
        const openKeys = ['ArrowDown', 'ArrowUp'];
        if (spaceSelects) {
          openKeys.push('Enter', ' ');
        }

        switch (key) {
          case 'ArrowDown':
          case 'ArrowUp':
            e.preventDefault();
            openDropdown(defaultOpenIndex);
            break;
          case 'Enter':
          case ' ':
            if (spaceSelects) {
              e.preventDefault();
              openDropdown(defaultOpenIndex);
            }
            break;
          case 'Home':
            e.preventDefault();
            openDropdown(0);
            break;
          case 'End':
            e.preventDefault();
            openDropdown(options.length - 1);
            break;
        }
      }
    },
    [defaultOpenIndex, isDropdownExpanded, onClose, openDropdown, options.length, selectActive, setIsDropdownExpanded, spaceSelects],
  );

  return { activeIndex, setActiveIndex, onKeyDown };
}
