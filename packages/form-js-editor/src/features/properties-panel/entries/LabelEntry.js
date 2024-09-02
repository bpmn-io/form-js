import { INPUTS, LABELED_NON_INPUTS } from '../Util';
import { DATETIME_SUBTYPES, DATE_LABEL_PATH, TIME_LABEL_PATH } from '@bpmn-io/form-js-viewer';
import { useService, useVariables } from '../hooks';
import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';

export function LabelEntry(props) {
  const { field, editField } = props;

  const entries = [];

  entries.push({
    id: 'date-label',
    component: DateLabel,
    editField,
    field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: function (field) {
      return (
        field.type === 'datetime' &&
        (field.subtype === DATETIME_SUBTYPES.DATE || field.subtype === DATETIME_SUBTYPES.DATETIME)
      );
    },
  });

  entries.push({
    id: 'time-label',
    component: TimeLabel,
    editField,
    field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: function (field) {
      return (
        field.type === 'datetime' &&
        (field.subtype === DATETIME_SUBTYPES.TIME || field.subtype === DATETIME_SUBTYPES.DATETIME)
      );
    },
  });

  const isSimplyLabled = (field) => {
    return [...INPUTS.filter((input) => input !== 'datetime'), ...LABELED_NON_INPUTS].includes(field.type);
  };

  entries.push({
    id: 'label',
    component: Label,
    editField,
    field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: isSimplyLabled,
  });

  return entries;
}

function Label(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = ['label'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  const label = getLabelText(field.type);

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label,
    singleLine: true,
    setValue,
    variables,
  });
}

function DateLabel(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = DATE_LABEL_PATH;

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Date label',
    singleLine: true,
    setValue,
    variables,
  });
}

function TimeLabel(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = TIME_LABEL_PATH;

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Time label',
    singleLine: true,
    setValue,
    variables,
  });
}

// helpers //////////

/**
 * @param {string} type
 * @returns {string}
 */
function getLabelText(type) {
  switch (type) {
    case 'group':
    case 'dynamiclist':
      return 'Group label';
    case 'table':
      return 'Table label';
    case 'iframe':
      return 'Title';
    default:
      return 'Field label';
  }
}
