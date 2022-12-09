import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { getValuesSource, VALUES_SOURCES, VALUES_SOURCES_DEFAULTS, VALUES_SOURCES_LABELS, VALUES_SOURCES_PATHS } from '@bpmn-io/form-js-viewer';

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

    Object.values(VALUES_SOURCES).forEach(source => {

      // Clear all values source definitions and default the newly selected one
      const newValue = value === source ? VALUES_SOURCES_DEFAULTS[source] : undefined;
      newProperties[VALUES_SOURCES_PATHS[source]] = newValue;
    });

    newField = editField(field, newProperties);
    return newField;
  };

  const getValuesSourceOptions = () => {

    return Object.values(VALUES_SOURCES).map((valueSource) => ({
      label: VALUES_SOURCES_LABELS[valueSource],
      value: valueSource
    }));
  };

  return SelectEntry({
    label: 'Type',
    element: field,
    getOptions: getValuesSourceOptions,
    getValue,
    id,
    setValue
  });
}
