import CalendarIcon from '../icons/calendar-placeholder.svg';
import flatpickr from 'flatpickr';

import { useEffect, useRef, useState } from 'preact/hooks';
import { prefixId } from '../../Util';

export default function Datepicker(props) {

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

  const onInputKeyDown = (e) => {
    if (e.code === 'Space') {
      flatpickrInstance.open();
      e.preventDefault();
    }
  };

  useEffect(() => {

    const instance = flatpickr(dateInputRef.current, {
      allowInput: true,
      dateFormat: 'm/d/Y',
      static: true,
      clickOpens: false,
      onChange
    });

    setFlatpickrInstance(instance);

    const focusSelectedOrCurrentDay = (e) => {
      const dayToFocus = instance.calendarContainer.querySelector('.flatpickr-day.selected') || instance.calendarContainer.querySelector('.flatpickr-day.today');

      // @ts-ignore
      dayToFocus && dayToFocus.focus();
    };

    const onCalendarFocusOut = (e) => {
      if (!instance.calendarContainer.contains(e.relatedTarget)) {
        instance.close();
      }
    };

    instance.config.onOpen = [
      (e) => setFreshFocus(false),
      focusSelectedOrCurrentDay,
      (e) => instance.calendarContainer.addEventListener('focusout', onCalendarFocusOut)
    ];

    instance.config.onClose = [
      (e) => instance.calendarContainer.removeEventListener('focusout', onCalendarFocusOut)
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
    <a class="fjs-input-button border-radius-left"
      onClick={ (e) => flatpickrInstance.open() }>
      <CalendarIcon />
    </a>
    <div style={ { width: '100%' } }>
      <input ref={ dateInputRef }
        type="text"
        id={ `${prefixId(id, formId)}--date` }
        class={ 'fjs-input hide-left-border ' + (isAlone ? 'border-radius-right' : '') }
        disabled={ disabled }
        placeholder="MM/DD/YYYY"
        autoComplete="false"
        onFocus={ (e) => freshFocus && flatpickrInstance.open() }
        onKeyDown={ (e) => onInputKeyDown(e) }
        data-input />
    </div>
  </div>;
}

