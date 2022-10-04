import { useContext, useEffect, useState } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import Datepicker from './parts/Datepicker';
import Timepicker from './parts/Timepicker';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'datetime';

export default function Datetime(props) {
  const {
    disabled,
    errors = [],
    field,
    onChange,
    value = ''
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const [ date, setDate ] = useState(null);
  const [ time, setTime ] = useState(null);
  const [ useDatePicker ] = useState(true);
  const [ useTimePicker ] = useState(true);

  useEffect(() => {

    if (disabled || (useDatePicker && date === null) || (useTimePicker && time === null)) {

      // props.onChange({ value: null }, field);
      return;
    }

    let compoundDate = null;

    if (useTimePicker) {

      compoundDate = new Date(time);

      if (useDatePicker) {
        compoundDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      }
      else {
        compoundDate.setUTCFullYear(2000, 0, 1);
      }
    }
    else {
      compoundDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0));
    }

    onChange({ value: compoundDate.toISOString() , field });

  }, [ date, time, onChange, field, disabled, useDatePicker, useTimePicker ]);

  const { formId } = useContext(FormContext);

  const datePickerProps = {
    id,
    formId,
    disabled,
    onChange: (d) => setDate(new Date(d))
  };

  const timePickerProps = {
    id,
    formId,
    disabled,
    onChange: (d) => setTime(new Date(d))
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <div class="fjs-vertical-group">
      { useDatePicker && <Datepicker { ...{ ...datePickerProps, isAlone: !useTimePicker } } /> }
      { useTimePicker && <Timepicker { ...{ ...timePickerProps, isAlone: !useDatePicker } } /> }
    </div>


    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Datetime.create = function(options = {}) {
  return {
    ...options
  };
};

Datetime.type = type;
Datetime.label = 'DateTime';
Datetime.keyed = true;
Datetime.emptyValue = '';