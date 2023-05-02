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
    readonly,
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

    let config = {
      allowInput: true,
      dateFormat: 'm/d/Y',
      static: true,
      clickOpens: false,

      // TODO: support dates prior to 1900 (https://github.com/bpmn-io/form-js/issues/533)
      minDate: disallowPassedDates ? 'today' : '01/01/1900',
      errorHandler: () => { /* do nothing, we expect the values to sometimes be erronous and we don't want warnings polluting the console */ }
    };

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

  }, [ disallowPassedDates ]);

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

      if (!flatpickrInstance || focusScopeRef.current.contains(e.relatedTarget) || readonly) return;

      flatpickrInstance.open();
    }, [ flatpickrInstance, readonly ]
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
      readonly={ readonly }
      rootRef={ focusScopeRef }
      inputRef={ dateInputRef }>
      <div class="fjs-datepicker" style={ { width: '100%' } }>
        <input ref={ dateInputRef }
          type="text"
          id={ fullId }
          class="fjs-input"
          disabled={ disabled }
          readOnly={ readonly }
          placeholder="mm/dd/yyyy"
          autoComplete="off"
          onFocus={ onInputFocus }
          onKeyDown={ onInputKeyDown }
          onMouseDown={ () => !flatpickrInstance.isOpen && !readonly && flatpickrInstance.open() }
          onBlur={ onInputBlur }
          onInput={ () => setIsInputDirty(true) }
          data-input
          aria-describedby={ props['aria-describedby'] } />
      </div>
    </InputAdorner>
  </div>
  ;
}
