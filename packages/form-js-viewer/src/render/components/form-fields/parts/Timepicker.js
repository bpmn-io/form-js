import ClockIcon from '../icons/Clock.svg';

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { prefixId } from '../../Util';
import DropdownList from './DropdownList';
import { isNumber } from 'min-dash';
import InputAdorner from './InputAdorner';
import { formatTime, parseInputTime } from '../../util/dateTimeUtil';

export default function Timepicker(props) {

  const {
    id,
    formId,
    disabled,
    readonly,
    use24h = false,
    timeInterval,
    time,
    setTime
  } = props;

  const timeInputRef = useRef();
  const [ dropdownIsOpen, setDropdownIsOpen ] = useState(false);
  const useDropdown = useMemo(() => timeInterval !== 1, [ timeInterval ]);

  const [ rawValue, setRawValue ] = useState('');

  // Shorts the time value back to the source
  useEffect(() => {

    const isNullTime = time === null;

    const adjustedTime = isNullTime ? null : time - (time % timeInterval);
    setRawValue(isNullTime ? '' : formatTime(use24h, adjustedTime));
    setTime(adjustedTime);
  }, [ time, setTime, use24h, timeInterval ]);

  const propagateRawToMinute = useCallback((newRawValue) => {

    const localRawValue = newRawValue || rawValue;

    // If no raw value exists, set the minute to null
    if (!localRawValue) {
      setTime(null);
      return;
    }

    const minutes = parseInputTime(localRawValue);

    // If raw string couldn't be parsed, clean everything up
    if (!isNumber(minutes)) {
      setRawValue('');
      setTime(null);
      return;
    }

    // Enforce the minutes to match the timeInterval
    const correctedMinutes = minutes - (minutes % timeInterval);

    // Enforce the raw text to be formatted properly
    setRawValue(formatTime(use24h, correctedMinutes));
    setTime(correctedMinutes);

  }, [ rawValue, timeInterval, use24h, setTime ]);

  const timeOptions = useMemo(() => {

    const minutesInDay = 24 * 60;
    const intervalCount = Math.floor(minutesInDay / timeInterval);
    return [ ...Array(intervalCount).keys() ].map(intervalIndex => formatTime(use24h, intervalIndex * timeInterval));

  }, [ timeInterval, use24h ]);

  const initialFocusIndex = useMemo(() => {

    // If there are no options, there will not be any focusing
    if (!timeOptions) return null;

    // If there is a set minute value, we focus it in the dropdown
    if (time) return time / timeInterval;

    // If there is no set value, simply focus the middle of the dropdown (12:00)
    return Math.floor(timeOptions.length / 2);

  }, [ time, timeInterval, timeOptions ]);

  const onInputKeyDown = (e) => {
    switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      break;
    case 'ArrowDown':
      useDropdown && setDropdownIsOpen(true);
      e.preventDefault();
      break;
    case 'Escape':
      useDropdown && setDropdownIsOpen(false);
      break;
    case 'Enter':
      !dropdownIsOpen && propagateRawToMinute();
      break;
    }
  };

  const onInputBlur = (e) => {
    setDropdownIsOpen(false);
    propagateRawToMinute();
  };

  const onDropdownValueSelected = (o) => {
    setDropdownIsOpen(false);
    propagateRawToMinute(o);
  };

  return <InputAdorner
    pre={ <ClockIcon /> }
    inputRef={ timeInputRef }
    disabled={ disabled }>
    <div style={ { width: '100%' } } class="fjs-timepicker-anchor">
      <input ref={ timeInputRef }
        type="text"
        id={ `${prefixId(id, formId)}--time` }
        class="fjs-input"

        // todo(pinussilvestrus): a11y concerns?
        tabIndex={ readonly ? -1 : 0 }
        value={ rawValue }
        disabled={ disabled }
        placeholder={ use24h ? 'HH:MM' : 'HH:MM ?M' }
        autoComplete="false"
        onFocus={ () => useDropdown && setDropdownIsOpen(true) }
        onClick={ () => useDropdown && setDropdownIsOpen(true) }

        // @ts-ignore
        onInput={ (e) => { setRawValue(e.target.value); useDropdown && setDropdownIsOpen(false); } }
        onBlur={ onInputBlur }
        onKeyDown={ onInputKeyDown }
        data-input />

      { dropdownIsOpen && <DropdownList
        values={ timeOptions }
        height={ 150 }
        onValueSelected={ onDropdownValueSelected }
        listenerElement={ timeInputRef.current }
        initialFocusIndex={ initialFocusIndex } /> }

    </div>
  </InputAdorner>;
}
