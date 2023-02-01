import classNames from 'classnames';
import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import useKeyDownAction from '../../../hooks/useKeyDownAction';

const DEFAULT_LABEL_GETTER = (value) => value;
const NOOP = () => {};

export default function DropdownList(props) {

  const {
    listenerElement = window,
    values = [],
    getLabel = DEFAULT_LABEL_GETTER,
    onValueSelected = NOOP,
    height = 235,
    emptyListMessage = 'No results',
    initialFocusIndex = 0
  } = props;

  const [ mouseControl, setMouseControl ] = useState(false);
  const [ focusedValueIndex, setFocusedValueIndex ] = useState(initialFocusIndex);
  const [ smoothScrolling, setSmoothScrolling ] = useState(false);
  const dropdownContainer = useRef();
  const mouseScreenPos = useRef();

  const focusedItem = useMemo(() => values.length ? values[focusedValueIndex] : null, [ focusedValueIndex, values ]);

  const changeFocusedValueIndex = useCallback((delta) => {
    setFocusedValueIndex(x => Math.min(Math.max(0, x + delta), values.length - 1));
  }, [ values.length ]);

  useEffect(() => {
    if (focusedValueIndex === 0) return;

    if (!focusedValueIndex || !values.length) {
      setFocusedValueIndex(0);
    }
    else if (focusedValueIndex >= values.length) {
      setFocusedValueIndex(values.length - 1);
    }
  }, [ focusedValueIndex, values.length ]);

  useKeyDownAction('ArrowUp', () => {
    if (values.length) {
      changeFocusedValueIndex(-1);
      setMouseControl(false);
    }
  }, listenerElement);

  useKeyDownAction('ArrowDown', () => {
    if (values.length) {
      changeFocusedValueIndex(1);
      setMouseControl(false);
    }
  }, listenerElement);

  useKeyDownAction('Enter', () => {
    if (focusedItem) {
      onValueSelected(focusedItem);
    }
  }, listenerElement);

  useEffect(() => {
    const individualEntries = dropdownContainer.current.children;
    if (individualEntries.length && !mouseControl) {
      individualEntries[focusedValueIndex].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [ focusedValueIndex, mouseControl ]);

  useEffect(() => {
    setSmoothScrolling(true);
  }, []);

  const onMouseMovedInKeyboardMode = (event, valueIndex) => {

    const userMovedCursor = !mouseScreenPos.current || mouseScreenPos.current.x !== event.screenX && mouseScreenPos.current.y !== event.screenY;

    if (userMovedCursor) {
      mouseScreenPos.current = { x: event.screenX, y: event.screenY };
      setMouseControl(true);
      setFocusedValueIndex(valueIndex);
    }

  };

  return <div
    ref={ dropdownContainer }
    tabIndex={ -1 }
    class="fjs-dropdownlist"
    onMouseDown={ (e) => e.preventDefault() }
    style={ { maxHeight: height, scrollBehavior: smoothScrolling ? 'smooth' : 'auto' } }>
    {
      values.length > 0 && values.map((v, i) => {
        return (
          <div
            class={ classNames('fjs-dropdownlist-item', { 'focused': focusedValueIndex === i }) }
            onMouseMove={ mouseControl ? undefined : (e) => onMouseMovedInKeyboardMode(e, i) }
            onMouseEnter={ mouseControl ? () => setFocusedValueIndex(i) : undefined }
            onMouseDown={ (e) => onValueSelected(v) }>
            {getLabel(v)}
          </div>
        );
      })
    }
    {
      !values.length && <div class="fjs-dropdownlist-empty">{ emptyListMessage }</div>
    }
  </div>;
}