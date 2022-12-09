import { ValuesSourceSelectEntry, StaticValuesSourceEntry, InputKeyValuesSourceEntry } from '../entries';
import { getValuesSource, VALUES_SOURCES } from '@bpmn-io/form-js-viewer';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

import {
  VALUES_INPUTS
} from '../Util';

export default function ValuesGroups(field, editField) {
  const {
    type,
    id: fieldId
  } = field;

  if (!VALUES_INPUTS.includes(type)) {
    return [];
  }

  const context = { editField, field };
  const valuesSourceId = `${fieldId}-valuesSource`;

  /**
   * @type {Array<Group|ListGroup>}
   */
  const groups = [
    {
      id: valuesSourceId,
      label: 'Options source',
      component: Group,
      entries: ValuesSourceSelectEntry({ ...context, id: valuesSourceId })
    }
  ];

  const valuesSource = getValuesSource(field);

  if (valuesSource === VALUES_SOURCES.INPUT) {
    const dynamicValuesId = `${fieldId}-dynamicValues`;
    groups.push({
      id: dynamicValuesId,
      label: 'Dynamic options',
      component: Group,
      entries: InputKeyValuesSourceEntry({ ...context, id: dynamicValuesId })
    });
  }
  else if (valuesSource === VALUES_SOURCES.STATIC) {
    const staticValuesId = `${fieldId}-staticValues`;
    groups.push({
      id: staticValuesId,
      label: 'Static options',
      component: ListGroup,
      ...StaticValuesSourceEntry({ ...context, id: staticValuesId })
    });
  }

  return groups;
}