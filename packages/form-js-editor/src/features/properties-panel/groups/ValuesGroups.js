import {
  ValuesSourceSelectEntry,
  StaticValuesSourceEntry,
  InputKeyValuesSourceEntry,
  ValuesExpressionEntry
} from '../entries';

import { getValuesSource, VALUES_SOURCES } from '@bpmn-io/form-js-viewer';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

import {
  VALUES_INPUTS,
  hasValuesGroupsConfigured
} from '../Util';

export default function ValuesGroups(field, editField, getService) {
  const {
    type
  } = field;

  const formFields = getService('formFields');

  const fieldDefinition = formFields.get(type).config;

  if (!VALUES_INPUTS.includes(type) && !hasValuesGroupsConfigured(fieldDefinition)) {
    return [];
  }

  const context = { editField, field };
  const id = 'valuesSource';

  /**
   * @type {Array<Group|ListGroup>}
   */
  const groups = [
    {
      id,
      label: 'Options source',
      tooltip: getValuesTooltip(),
      component: Group,
      entries: ValuesSourceSelectEntry({ ...context, id })
    }
  ];

  const valuesSource = getValuesSource(field);

  if (valuesSource === VALUES_SOURCES.INPUT) {
    const id = 'dynamicValues';
    groups.push({
      id,
      label: 'Dynamic options',
      component: Group,
      entries: InputKeyValuesSourceEntry({ ...context, id })
    });
  } else if (valuesSource === VALUES_SOURCES.STATIC) {
    const id = 'staticValues';
    groups.push({
      id,
      label: 'Static options',
      component: ListGroup,
      ...StaticValuesSourceEntry({ ...context, id })
    });
  } else if (valuesSource === VALUES_SOURCES.EXPRESSION) {
    const id = 'valuesExpression';
    groups.push({
      id,
      label: 'Options expression',
      component: Group,
      entries: ValuesExpressionEntry({ ...context, id })
    });
  }

  return groups;
}

// helpers //////////

function getValuesTooltip() {
  return '"Static" defines a constant, predefined set of form options.\n\n' +
  '"Input data" defines options that are populated dynamically, adjusting based on variable data for flexible responses to different conditions or inputs.\n\n' +
  '"Expression" defines options that are populated from a FEEL expression.';
}