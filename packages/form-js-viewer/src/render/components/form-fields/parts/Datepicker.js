import CalendarIcon from '../icons/Calendar.svg';
import flatpickr from 'flatpickr';

import { ENTER_KEYDOWN_EVENT, focusRelevantFlatpickerDay } from '../../util/dateTimeUtil';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { prefixId } from '../../Util';
import InputAdorner from './InputAdorner';
import Label from '../../Label';

export default function Datepicker(props) {

  const {
    id,
    label,
    collapseLabelOnEmpty,
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

  const [ forceFocusCalendar, setForceFocusCalendar ] = useState(false);

  // shorts the date value back to the source
  useEffect(() => {

    if (!flatpickrInstance || !flatpickrInstance.config) return;

    flatpickrInstance.setDate(date, true);
    setIsInputDirty(false);

  }, [ flatpickrInstance, date.toString() ]);

  useEffect(() => {

    if (!forceFocusCalendar) return;

    focusRelevantFlatpickerDay(flatpickrInstance);
    setForceFocusCalendar(false);

  }, [ flatpickrInstance, forceFocusCalendar ]);

  // setup flatpickr instance
  useEffect(() => {

    if (disabled) {
      setFlatpickrInstance(null);
      return;
    }

    let config = {
      allowInput: true,
      dateFormat: 'm/d/Y',
      static: true,
      clickOpens: false,
      errorHandler: () => { /* do nothing, we expect the values to sometimes be erronous and we don't want warnings polluting the console */ }
    };

    if (disallowPassedDates) {
      config = { ...config, minDate: 'today' };
    }

    const instance = flatpickr(dateInputRef.current, config);

    setFlatpickrInstance(instance);

    const onCalendarFocusOut = (e) => {
      if (!instance.calendarContainer.contains(e.relatedTarget) && e.relatedTarget != dateInputRef.current) {
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
    ];

  }, [ disabled, disallowPassedDates ]);

  // onChange is updated dynamically, so not to re-render the flatpicker every time it changes
  useEffect(() => {

    if (!flatpickrInstance || !flatpickrInstance.config) return;

    flatpickrInstance.config.onChange = [ (date) => setDate(new Date(date)), () => setIsInputDirty(false) ];

  }, [ flatpickrInstance, setDate ]);

  const onInputKeyDown = useCallback(
    (e) => {

      if (!flatpickrInstance) return;

      if (e.code === 'Escape') {
        flatpickrInstance.close();
      }

      if (e.code === 'ArrowDown') {

        if (isInputDirty) {

          // trigger an enter keypress to submit the new input, then focus calendar day on the next render cycle
          dateInputRef.current.dispatchEvent(ENTER_KEYDOWN_EVENT);
          setIsInputDirty(false);
          setForceFocusCalendar(true);
        }
        else {

          // focus calendar day immediately
          focusRelevantFlatpickerDay(flatpickrInstance);
        }

        e.preventDefault();
      }

      if (e.code === 'Enter') {
        setIsInputDirty(false);
      }
    },
    [ flatpickrInstance, isInputDirty ],
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

      if (!isInputDirty || e.relatedTarget && e.relatedTarget.classList.contains('flatpickr-day')) return;
      dateInputRef.current.dispatchEvent(ENTER_KEYDOWN_EVENT);
      setIsInputDirty(false);

    }, [ isInputDirty ]
  );

  const fullId = `${prefixId(id, formId)}--date`;

  return <div class="fjs-datetime-subsection">
    <Label
      id={ fullId }
      label={ label }
      collapseOnEmpty={ collapseLabelOnEmpty }
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
          placeholder="mm/dd/yyyy"
          autoComplete="false"
          onFocus={ onInputFocus }
          onKeyDown={ onInputKeyDown }
          onMouseDown={ (e) => !flatpickrInstance.isOpen && flatpickrInstance.open() }
          onBlur={ onInputBlur }
          onInput={ (e) => setIsInputDirty(true) }
          data-input />
      </div>
    </InputAdorner>
  </div>
  ;
}
