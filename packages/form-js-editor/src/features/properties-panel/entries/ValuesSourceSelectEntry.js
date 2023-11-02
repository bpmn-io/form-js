import { isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { AutoFocusSelectEntry } from '../components';

import {
  getValuesSource,
  VALUES_SOURCES,
  VALUES_SOURCES_DEFAULTS,
  VALUES_SOURCES_LABELS,
  VALUES_SOURCES_PATHS
} from '@bpmn-io/form-js-viewer';


export default function ValuesSourceSelectEntry(props) {
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

  const getValue = getValuesSource;

  const setValue = (value) => {

    let newField = field;

    const newProperties = {};

    newProperties[VALUES_SOURCES_PATHS[value]] = VALUES_SOURCES_DEFAULTS[value];

    newField = editField(field, newProperties);
    return newField;
  };

  const getValuesSourceOptions = () => {

    return Object.values(VALUES_SOURCES).map((valueSource) => ({
      label: VALUES_SOURCES_LABELS[valueSource],
      value: valueSource
    }));
  };

  return AutoFocusSelectEntry({
    autoFocusEntry: getAutoFocusEntryId(field),
    label: 'Type',
    element: field,
    getOptions: getValuesSourceOptions,
    getValue,
    id,
    setValue
  });
}

// helpers //////////

function getAutoFocusEntryId(field) {
  const valuesSource = getValuesSource(field);

  if (valuesSource === VALUES_SOURCES.EXPRESSION) {
    return `${field.id}-valuesExpression-expression`;
  } else if (valuesSource === VALUES_SOURCES.INPUT) {
    return `${field.id}-dynamicValues-key`;
  } else if (valuesSource === VALUES_SOURCES.STATIC) {
    return `${field.id}-staticValues-0-label`;
  }

  return null;
}
