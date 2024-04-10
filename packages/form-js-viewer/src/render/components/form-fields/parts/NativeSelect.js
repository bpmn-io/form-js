import { useCallback, useState } from 'preact/hooks';
import classNames from 'classnames';
import { useOptionsAsync } from '../../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../../hooks/useCleanupSingleSelectValue';
import { useLookUpTable } from '../../../hooks/useLookUpTable';

export function NativeSelect(props) {
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

  const [ selectedIndex, setSelectedIndex ] = useState(() => options && value ? indexFromValue(value, -1) : -1);
  const [ activeIndex, setActiveIndex ] = useState(selectedIndex);

  const setValue = useCallback((index, value) => {
    setSelectedIndex(index);
    setActiveIndex(index);
    props.onChange({ value: value || null, field });
  }, [ field, props ]);

  return <>
    <select
      id={ `${domId}-native` }
      class={ classNames('fjs-native-select', 'fjs-select', { disabled, readonly, 'hasErrors': errors.length }) }
      aria-labelledby={ ariaLabelledById }
      size={ 1 }
      disabled={ readonly || disabled }
      onChange={ (ev) => {

        // @ts-expect-error Target should be an HTMLSelectElement
        const value = ev.target.value;
        const selected = indexFromValue(value);
        setValue(selected, value);
      } }
      onFocus={ onFocus }
      onBlur={ onBlur }>
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
  
}
