import CalendarIcon from '../icons/Calendar.svg';
import flatpickr from 'flatpickr';

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { prefixId } from '../../Util';
import InputAdorner from './InputAdorner';
import Label from '../../Label';

export default function Datepicker(props) {

  const {
    id,
    label,
    formId,
    required,
    disabled,
    disallowPassedDates,
    date,
    setDate
  } = props;

  const dateInputRef = useRef();
  const focusScopeRef = useRef();
  const [ flatpickrInstance, setFlatpickrInstance ] = useState(null);
  const [ isInputDirty, setIsInputDirty ] = useState(false);
  const [ forceRefreshValue, setForceRefreshValue ] = useState(false);

  const enterKeyboardEvent = useMemo(() => new KeyboardEvent('keydown', {
    code: 'Enter',
    key: 'Enter',
    charCode: 13,
    keyCode: 13,
    view: window,
    bubbles: true
  }), []);

  // Generate an enter press to submit the data on all blurs
  useEffect(() => {

    if (!forceRefreshValue) return;

    dateInputRef.current.dispatchEvent(enterKeyboardEvent);
    setIsInputDirty(false);
    setForceRefreshValue(false);

  }, [ enterKeyboardEvent, forceRefreshValue ]);


  useEffect(() => {

    if (disabled) {
      setFlatpickrInstance(null);
      return;
    }

    let config = {
      allowInput: true,
      dateFormat: 'm/d/Y',
      static: true,
      clickOpens: false
    };

    if (disallowPassedDates) {
      config = { ...config, minDate: 'today' };
    }

    const instance = flatpickr(dateInputRef.current, config);

    setFlatpickrInstance(instance);

    const onCalendarFocusOut = (e) => {
      if (!instance.calendarContainer.contains(e.relatedTarget)) {
        instance.close();
      }
    };

    // remove dirty tag to have mouse day selection prioritize input blur
    const onCalendarMouseDown = (e) => {
      if (e.target.classList.contains('flatpickr-day')) {
        setIsInputDirty(false);
      }
    };

    // when the dropdown of the datepickr opens, we register a few event handlers to re-implement some of the
    // flatpicker logic that was lost when setting allowInput to true
    instance.config.onOpen = [
      () => instance.calendarContainer.addEventListener('focusout', onCalendarFocusOut),
      () => instance.calendarContainer.addEventListener('mousedown', onCalendarMouseDown),
    ];

    instance.config.onClose = [
      () => instance.calendarContainer.removeEventListener('focusout', onCalendarFocusOut),
      () => instance.calendarContainer.removeEventListener('mousedown', onCalendarMouseDown),
      () => { setForceRefreshValue(true); }
    ];

  }, [ disabled, disallowPassedDates, enterKeyboardEvent ]);

  // Shorts the date value back to the source
  useEffect(() => {

    if (!flatpickrInstance || !flatpickrInstance.config) return;

    flatpickrInstance.setDate(date, true);

  }, [ flatpickrInstance, date.toString() ]);

  // OnChange is updated dynamically, so not to re-render the flatpicker every time it changes
  useEffect(() => {

    if (!flatpickrInstance || !flatpickrInstance.config) return;

    flatpickrInstance.config.onChange = [ (date) => setDate(new Date(date)) ];

  }, [ flatpickrInstance, setDate ]);

  const focusRelevantCalendarDay = useCallback(
    (e) => {

      if (!flatpickrInstance) return;

      const container = flatpickrInstance.calendarContainer;
      const dayToFocus =
        container.querySelector('.flatpickr-day.selected') ||
        container.querySelector('.flatpickr-day.today') ||
        container.querySelector('.flatpickr-day');

      dayToFocus && dayToFocus.focus();
    },
    [ flatpickrInstance ]
  );

  const onInputKeyDown = useCallback(
    (e) => {

      if (!flatpickrInstance) return;

      if (e.code === 'ArrowDown') {
        !flatpickrInstance.isOpen && flatpickrInstance.open();
        focusRelevantCalendarDay();
        e.preventDefault();
      }
    },
    [ flatpickrInstance, focusRelevantCalendarDay ],
  );

  const onInputFocus = useCallback(
    (e) => {

      if (!flatpickrInstance || focusScopeRef.current.contains(e.relatedTarget)) return;

      flatpickrInstance.open();
    }, [ flatpickrInstance ]
  );

  // simulate an enter press on blur to make sure the date value is submitted in all scenarios
  const onInputBlur = useCallback(
    (e) => {

      if (!isInputDirty || !e.relatedTarget || e.relatedTarget.classList.contains('flatpickr-day')) return;
      setForceRefreshValue(true);

    }, [ isInputDirty ]
  );

  const fullId = `${prefixId(id, formId)}--date`;

  return <div class="fjs-datetime-subsection">
    <Label
      id={ fullId }
      label={ label }
      required={ required } />
    <InputAdorner
      pre={ <CalendarIcon /> }
      disabled={ disabled }
      rootRef={ focusScopeRef }
      inputRef={ dateInputRef }>
      <div class="fjs-datepicker" style={ { width: '100%' } }>
        <input ref={ dateInputRef }
          type="text"
          id={ fullId }
          class={ 'fjs-input' }
          disabled={ disabled }
          placeholder="MM/DD/YYYY"
          autoComplete="false"
          onFocus={ onInputFocus }
          onKeyDown={ onInputKeyDown }
          onBlur={ onInputBlur }
          onInput={ (e) => setIsInputDirty(true) }
          data-input />
      </div>
    </InputAdorner>
  </div>
  ;
}
