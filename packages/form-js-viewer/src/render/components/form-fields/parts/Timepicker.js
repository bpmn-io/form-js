import ClockIcon from '../icons/Clock.svg';

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { prefixId } from '../../Util';
import DropdownList from './DropdownList';
import { isNumber } from 'min-dash';
import InputAdorner from './InputAdorner';
import { formatTime, parseInputTime } from '../../util/dateTimeUtil';
import Label from '../../Label';

export default function Timepicker(props) {

  const {
    id,
    label,
    collapseLabelOnEmpty,
    formId,
    required,
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

  // populates values from source
  useEffect(() => {
    if (time === null) {
      setRawValue('');
      return;
    }

    const intervalAdjustedTime = time - (time % timeInterval);
    setRawValue(formatTime(use24h, intervalAdjustedTime));

    if (intervalAdjustedTime != time) {
      setTime(intervalAdjustedTime);
    }

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

    // if there are no options, there will not be any focusing
    if (!timeOptions || !timeInterval) return null;

    // if there is a set minute value, we focus it in the dropdown
    if (time) return time / timeInterval;

    const cacheTime = parseInputTime(rawValue);

    // if there is a valid value in the input cache, we try and focus close to it
    if (cacheTime) {
      const flooredCacheTime = cacheTime - cacheTime % timeInterval;
      return flooredCacheTime / timeInterval;
    }

    // If there is no set value, simply focus the middle of the dropdown (12:00)
    return Math.floor(timeOptions.length / 2);

  }, [ rawValue, time, timeInterval, timeOptions ]);

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

  const onDropdownValueSelected = (value) => {
    setDropdownIsOpen(false);
    propagateRawToMinute(value);
  };

  const fullId = `${prefixId(id, formId)}--time`;

  return <div class="fjs-datetime-subsection">
    <Label
      id={ fullId }
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
          id={ fullId }
          class="fjs-input"
          value={ rawValue }
          disabled={ disabled }
          readOnly={ readonly }
          placeholder={ use24h ? 'hh:mm' : 'hh:mm ?m' }
          autoComplete="off"
          onFocus={ () => !readonly && useDropdown && setDropdownIsOpen(true) }
          onClick={ () => !readonly && useDropdown && setDropdownIsOpen(true) }

          // @ts-ignore
          onInput={ (e) => { setRawValue(e.target.value); useDropdown && setDropdownIsOpen(false); } }
          onBlur={ onInputBlur }
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
