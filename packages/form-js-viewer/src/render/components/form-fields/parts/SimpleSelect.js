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
    value
  } = props;

  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const selectRef = useRef();
  const inputRef = useRef();

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

  const valueLabel = useMemo(() => value && getLabelCorrelation(value), [ value, getLabelCorrelation ]);

  const setValue = useCallback((option) => {
    props.onChange({ value: option && option.value || null, field });
  }, [ field, props ]);

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null && value !== undefined;
    ds.displayDropdown = !disabled && !readonly && isDropdownExpanded;
    return ds;
  }, [ disabled, isDropdownExpanded, loadState, readonly, value ]);

  const onMouseDown = useCallback((e) => {

    const input = inputRef.current;

    if (disabled || !input) {
      return;
    }

    setIsDropdownExpanded(!isDropdownExpanded);

    if (isDropdownExpanded) {
      input.blur();
    } else {
      input.focus();
    }

    e.preventDefault();
  }, [ disabled, isDropdownExpanded ]);

  const initialFocusIndex = useMemo(() => value && findIndex(options, (o) => o.value === value) || 0, [ options, value ]);

  const onInputFocus = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(true);
      onFocus && onFocus();
    }
  }, [ onFocus, readonly ]);

  const onInputBlur = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(false);
      onBlur && onBlur();
    }
  }, [ onBlur, readonly ]);

  return <>
    <div ref={ selectRef }
      class={ classNames('fjs-input-group', { disabled, readonly }, { 'hasErrors': errors.length }) }
      onFocus={ onInputFocus }
      onBlur={ onInputBlur }
      onMouseDown={ onMouseDown }>
      <div class={ classNames('fjs-select-display', { 'fjs-select-placeholder' : !value }) } id={ `${domId}-display` }>{ valueLabel || 'Select' }</div>
      { !disabled && <input
        ref={ inputRef }
        id={ domId }
        class="fjs-select-hidden-input"
        value={ valueLabel }
        onFocus={ onInputFocus }
        onBlur={ onInputBlur }
        aria-describedby={ props['aria-describedby'] } />
      }
      { displayState.displayCross && <span class="fjs-select-cross" onMouseDown={ (e) => { setValue(null); e.stopPropagation(); } }><XMarkIcon /></span> }
      <span class="fjs-select-arrow">{ displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon /> }</span>
    </div>
    <div class="fjs-select-anchor">
      {displayState.displayDropdown && <DropdownList
        values={ options }
        getLabel={ (o) => o.label }
        initialFocusIndex={ initialFocusIndex }
        onValueSelected={ (o) => { setValue(o); setIsDropdownExpanded(false); } }
        listenerElement={ selectRef.current } />}
    </div>
  </>;
}
