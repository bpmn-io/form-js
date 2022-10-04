import ClockIcon from '../icons/clock-placeholder.svg';
import flatpickr from 'flatpickr';

import { useEffect, useRef, useState } from 'preact/hooks';
import { prefixId, formatTimezoneOffset } from '../../Util';

export default function Timepicker(props) {

  const {
    id,
    formId,
    disabled,
    onChange,
    isAlone
  } = props;

  const dateInputRef = useRef();
  const focusScopeRef = useRef();
  const [ flatpickrInstance, setFlatpickrInstance ] = useState(null);
  const [ freshFocus, setFreshFocus ] = useState(true);
  const [ timezoneOffset ] = useState(new Date().getTimezoneOffset());

  const onInputKeyDown = (e) => {
    if (e.code === 'Space') {
      flatpickrInstance.open();
      e.preventDefault();
    }
  };

  useEffect(() => {

    let isDirty = false;
    let dateObject = null;

    const instance = flatpickr(dateInputRef.current, {
      allowInput: true,
      enableTime: true,
      time_24hr: true,
      noCalendar: true,
      dateFormat: 'H:i',
      static: true,
      clickOpens: false,
      onChange: (d) => {
        dateObject = d;
        isDirty = true;
      }
    });

    setFlatpickrInstance(instance);

    const focusHourInput = (e) => {
      const hourInput = instance.calendarContainer.querySelector('.numInput.flatpickr-hour');

      // @ts-ignore
      hourInput && hourInput.focus();
    };

    const onCalendarFocusOut = (e) => {
      if (!instance.calendarContainer.contains(e.relatedTarget)) {
        instance.close();
      }
    };

    instance.config.onOpen = [
      (e) => setFreshFocus(false),
      focusHourInput,
      (e) => instance.calendarContainer.addEventListener('focusout', onCalendarFocusOut),
    ];

    instance.config.onClose = [
      (e) => instance.calendarContainer.removeEventListener('focusout', onCalendarFocusOut),
      (e) => isDirty && dateObject && onChange(dateObject)
    ];

    // We reset the forced closed state when leaving the scope of the datepicker, so that tabbing back in will display the calendar again
    const onVerticalGroupFocusOut = (e) => {
      if (!focusScopeRef.current.parentNode.contains(e.relatedTarget)) {
        setFreshFocus(true);
      }
    };

    const currentAnchorRef = focusScopeRef.current;
    currentAnchorRef.parentNode.addEventListener('focusout', onVerticalGroupFocusOut);
    return () => currentAnchorRef.parentNode.removeEventListener('focusout', onVerticalGroupFocusOut);

  }, [ onChange ]);

  return <div class="fjs-vertical-group"
    ref={ focusScopeRef }>
    <a class={ 'fjs-input-button ' + (isAlone ? 'border-radius-left' : 'hide-left-border') } onClick={ (e) => flatpickrInstance.open() }>
      <ClockIcon />
    </a>
    <div style={ { width: '100%' } }>
      <input ref={ dateInputRef }
        type="text"
        id={ `${prefixId(id, formId)}--time` }
        class="fjs-input hide-left-border"
        disabled={ disabled }
        placeholder="HH:MM"
        autoComplete="false"
        onFocus={ (e) => freshFocus && flatpickrInstance.open() }
        onKeyDown={ (e) => onInputKeyDown(e) }
        data-input />
    </div>
    <a class="fjs-input-button hide-left-border border-radius-right" onClick={ (e) => flatpickrInstance.open() }>
      <span>{formatTimezoneOffset(timezoneOffset)}</span>
    </a>
  </div>;
}

