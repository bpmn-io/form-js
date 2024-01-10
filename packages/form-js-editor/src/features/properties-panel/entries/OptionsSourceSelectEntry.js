import { isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { AutoFocusSelectEntry } from '../components';

import {
  getOptionsSource,
  OPTIONS_SOURCES,
  OPTIONS_SOURCES_DEFAULTS,
  OPTIONS_SOURCES_LABELS,
  OPTIONS_SOURCES_PATHS
} from '@bpmn-io/form-js-viewer';


export function OptionsSourceSelectEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  return [
    {
      id: id + '-select',
      component: ValuesSourceSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    }
  ];
}

function ValuesSourceSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  const getValue = getOptionsSource;

  const setValue = (value) => {

    let newField = field;

    const newProperties = {};

    newProperties[OPTIONS_SOURCES_PATHS[value]] = OPTIONS_SOURCES_DEFAULTS[value];

    newField = editField(field, newProperties);
    return newField;
  };

  const getOptionsSourceOptions = () => {

    return Object.values(OPTIONS_SOURCES).map((valueSource) => ({
      label: OPTIONS_SOURCES_LABELS[valueSource],
      value: valueSource
    }));
  };

  return AutoFocusSelectEntry({
    autoFocusEntry: getAutoFocusEntryId(field),
    label: 'Type',
    element: field,
    getOptions: getOptionsSourceOptions,
    getValue,
    id,
    setValue
  });
}

// helpers //////////

function getAutoFocusEntryId(field) {
  const valuesSource = getOptionsSource(field);

  if (valuesSource === OPTIONS_SOURCES.EXPRESSION) {
    return 'optionsExpression-expression';
  } else if (valuesSource === OPTIONS_SOURCES.INPUT) {
    return 'dynamicOptions-key';
  } else if (valuesSource === OPTIONS_SOURCES.STATIC) {
    return 'staticOptions-0-label';
  }

  return null;
}
