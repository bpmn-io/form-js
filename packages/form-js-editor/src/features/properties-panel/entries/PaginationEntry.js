import { get, isNumber } from 'min-dash';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';


export function PaginationEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [];

  entries.push({
    id: 'pagination',
    component: Pagination,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => field.type === 'table'
  });

  return entries;
}

function Pagination(props) {
  const {
    editField,
    field,
    id
  } = props;
  const defaultRowCount = 10;

  const path = [ 'rowCount' ];

  const getValue = () => {
    return isNumber(get(field, path));
  };

  /**
    * @param {boolean} value
    */
  const setValue = (value) => {
    value ? editField(field, path, defaultRowCount) : editField(field, path, undefined);
  };

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label: 'Pagination',
    inline: true,
    setValue,
  });
}