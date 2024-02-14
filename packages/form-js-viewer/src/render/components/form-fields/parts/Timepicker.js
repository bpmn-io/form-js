import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { formatTime, parseInputTime } from '../../util/dateTimeUtil';
import { isNumber } from 'min-dash';

import ClockIcon from '../icons/Clock.svg';
import { DropdownList } from './DropdownList';
import { InputAdorner } from './InputAdorner';
import { Label } from '../../Label';

export function Timepicker(props) {

  const {
    label,
    collapseLabelOnEmpty,
    onDateTimeBlur,
    onDateTimeFocus,
    domId,
    required,
    disabled,
    readonly,
    use24h = false,
    timeInterval,
    time,
    setTime
  } = props;

  const safeTimeInterval = useMemo(() => {

    const allowedIntervals = [ 1, 5, 10, 15, 30, 60 ];

    if (allowedIntervals.includes(timeInterval)) {
      return timeInterval;
    }

    return 15;

  }, [ timeInterval ]);

  const timeInputRef = useRef();
  const [ dropdownIsOpen, setDropdownIsOpen ] = useState(false);
  const useDropdown = useMemo(() => safeTimeInterval !== 1, [ safeTimeInterval ]);

  const [ rawValue, setRawValue ] = useState('');

  // populates values from source
  useEffect(() => {
    if (time === null) {
      setRawValue('');
      return;
    }

    const intervalAdjustedTime = time - (time % safeTimeInterval);
    setRawValue(formatTime(use24h, intervalAdjustedTime));

    if (intervalAdjustedTime != time) {
      setTime(intervalAdjustedTime);
    }

  }, [ time, setTime, use24h, safeTimeInterval ]);

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
    const correctedMinutes = minutes - (minutes % safeTimeInterval);

    // Enforce the raw text to be formatted properly
    setRawValue(formatTime(use24h, correctedMinutes));
    setTime(correctedMinutes);

  }, [ rawValue, safeTimeInterval, use24h, setTime ]);

  const timeOptions = useMemo(() => {

    const minutesInDay = 24 * 60;
    const intervalCount = Math.floor(minutesInDay / safeTimeInterval);
    return [ ...Array(intervalCount).keys() ].map(intervalIndex => formatTime(use24h, intervalIndex * safeTimeInterval));

  }, [ safeTimeInterval, use24h ]);

  const initialFocusIndex = useMemo(() => {

    // if there are no options, there will not be any focusing
    if (!timeOptions || !safeTimeInterval) return null;

    // if there is a set minute value, we focus it in the dropdown
    if (time) return time / safeTimeInterval;

    const cacheTime = parseInputTime(rawValue);

    // if there is a valid value in the input cache, we try and focus close to it
    if (cacheTime) {
      const flooredCacheTime = cacheTime - cacheTime % safeTimeInterval;
      return flooredCacheTime / safeTimeInterval;
    }

    // If there is no set value, simply focus the middle of the dropdown (12:00)
    return Math.floor(timeOptions.length / 2);

  }, [ rawValue, time, safeTimeInterval, timeOptions ]);

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
    onDateTimeBlur(e);
  };

  const onInputFocus = (e) => {
    onDateTimeFocus(e);
    !readonly && useDropdown && setDropdownIsOpen(true);
  };

  const onDropdownValueSelected = (value) => {
    setDropdownIsOpen(false);
    propagateRawToMinute(value);
  };

  return <div class="fjs-datetime-subsection">
    <Label
      htmlFor={ domId }
      label={ label }
      collapseOnEmpty={ collapseLabelOnEmpty }
      required={ required } />
    <InputAdorner
      pre={ <ClockIcon /> }
      inputRef={ timeInputRef }
      disabled={ disabled }
      readonly={ readonly }>
      <div class="fjs-timepicker fjs-timepicker-anchor">
        <input ref={ timeInputRef }
          type="text"
          id={ domId }
          class="fjs-input"
          value={ rawValue }
          disabled={ disabled }
          readOnly={ readonly }
          placeholder={ use24h ? 'hh:mm' : 'hh:mm ?m' }
          autoComplete="off"

          // @ts-ignore
          onInput={ (e) => { setRawValue(e.target.value); useDropdown && setDropdownIsOpen(false); } }
          onBlur={ onInputBlur }
          onFocus={ onInputFocus }
          onClick={ () => !readonly && useDropdown && setDropdownIsOpen(true) }
          onKeyDown={ onInputKeyDown }
          data-input
          aria-describedby={ props['aria-describedby'] } />

        { dropdownIsOpen && <DropdownList
          values={ timeOptions }
          height={ 150 }
          onValueSelected={ onDropdownValueSelected }
          listenerElement={ timeInputRef.current }
          initialFocusIndex={ initialFocusIndex } /> }

      </div>
    </InputAdorner>
  </div>;
}
