import { INPUTS } from '../Util';
import { DATETIME_SUBTYPES, DATE_LABEL_PATH, TIME_LABEL_PATH } from '@bpmn-io/form-js-viewer';
import { simpleStringEntryFactory } from './factories';

export default function LabelEntry(props) {
  const {
    field
  } = props;

  const {
    type,
    subtype
  } = field;

  const entries = [];

  if (type === 'datetime') {
    if (subtype === DATETIME_SUBTYPES.DATE || subtype === DATETIME_SUBTYPES.DATETIME) {
      entries.push(
        simpleStringEntryFactory({
          id: 'date-label',
          path: DATE_LABEL_PATH,
          label: 'Date label',
          props
        })
      );
    }
    if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {
      entries.push(
        simpleStringEntryFactory({
          id: 'time-label',
          path: TIME_LABEL_PATH,
          label: 'Time label',
          props
        })
      );
    }
  }
  else if (INPUTS.includes(type) || type === 'button') {
    entries.push(
      simpleStringEntryFactory({
        id: 'label',
        path: [ 'label' ],
        label: 'Field label',
        props
      })
    );
  }

  return entries;
}
