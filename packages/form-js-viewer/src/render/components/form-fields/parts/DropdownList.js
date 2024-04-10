import classNames from 'classnames';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';

const DEFAULT_LABEL_GETTER = (value) => value;
const NOOP = () => {};
const DEFAULT_ID = 'dropdown';
const DEFAULT_OPTION_ID_GETTER = (i) => `dropdown-option-${i}`;

function Option(props) {
  const {
    id,
    value,
    i,
    focused,
    selected,
    onClick,
    onHover,
    children
  } = props;

  // Memoize the mouse handlers so that screenreaders don't call them out
  // as "clickable".
  const onMouseDown = useCallback(() => onClick(i, value), [ i, onClick, value ]);
  const onMouseEnter = useCallback(() => onHover(i, value), [ i, onHover, value ]);

  return <div
    id={ id }
    role="option"
    class={ classNames(
      'fjs-dropdownlist-item',
      { 'focused': focused }
    ) }
    aria-selected={ selected }
    data-value={ value.value }
    onMouseEnter={ onMouseEnter }
    onMouseDown={ onMouseDown }>
    {children}
  </div>;
}

export function DropdownList(props) {
  const {
    id = DEFAULT_ID,
    optionDomId = DEFAULT_OPTION_ID_GETTER,
    values = [],
    getLabel = DEFAULT_LABEL_GETTER,
    onClick = NOOP,
    onHover = NOOP,
    height = 235,
    emptyListMessage = 'No results',
    activeIndex = -1,
    selectedIndex = -1,
    hidden = false,
    'aria-labelledby': ariaLabelledById
  } = props;

  const [ smoothScrolling, setSmoothScrolling ] = useState(false);
  useEffect(() => {
    setSmoothScrolling(true);
  }, []);

  const listBoxRef = useRef();

  useEffect(() => {
    if (hidden) return;
    const children = listBoxRef.current.children;
    if (children.length) {
      const focusedEntry = children[activeIndex];
      focusedEntry && focusedEntry.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [ hidden, activeIndex ]);

  return <div
    ref={ listBoxRef }
    id={ id }
    role="listbox"
    class="fjs-dropdownlist"
    aria-labelledby={ ariaLabelledById }
    tabIndex={ -1 }
    style={ {
      display: hidden ? 'none' : 'block',
      maxHeight: `${height}px`,
      scrollBehavior: smoothScrolling ? 'smooth' : 'auto',
    } }
  >
    {values.length === 0 &&
    <div
      role="presentation"
      aria-hidden={ true }
      class={ classNames('fjs-dropdownlist-item', 'fjs-select-placeholder') }>
      {emptyListMessage}
    </div>}
    {values.map((value, i) => <Option
      key={ value.value }
      id={ optionDomId(i) }
      i={ i }
      value={ value }
      focused={ activeIndex === i }
      selected={ selectedIndex === i }
      onClick={ onClick }
      onHover={ onHover }
    >
      {getLabel(value)}
    </Option>)}
  </div>;
}