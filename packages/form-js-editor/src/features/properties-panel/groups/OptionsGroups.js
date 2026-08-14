import {
  OptionsSourceSelectEntry,
  StaticOptionsSourceEntry,
  InputKeyOptionsSourceEntry,
  OptionsExpressionEntry,
} from '../entries';

import { getOptionsSource, OPTIONS_SOURCES } from '@bpmn-io/form-js-viewer';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

import { OPTIONS_INPUTS, hasOptionsGroupsConfigured } from '../Util';

export function OptionsGroups(field, editField, getService) {
  const { type } = field;

  const formFields = getService('formFields');
  const translate = getService('translate');

  const fieldDefinition = formFields.get(type).config;

  if (!OPTIONS_INPUTS.includes(type) && !hasOptionsGroupsConfigured(fieldDefinition)) {
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
      label: translate('Options source'),
      tooltip: getValuesTooltip(translate),
      component: Group,
      entries: OptionsSourceSelectEntry({ ...context, id, translate }),
    },
  ];

  const valuesSource = getOptionsSource(field);

  if (valuesSource === OPTIONS_SOURCES.INPUT) {
    const id = 'dynamicOptions';
    groups.push({
      id,
      label: translate('Dynamic options'),
      component: Group,
      entries: InputKeyOptionsSourceEntry({ ...context, id }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.STATIC) {
    const id = 'staticOptions';
    groups.push({
      id,
      label: translate('Static options'),
      component: (props) => ListGroup({ ...props, translate }),
      ...StaticOptionsSourceEntry({ ...context, id, translate }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.EXPRESSION) {
    const id = 'optionsExpression';
    groups.push({
      id,
      label: translate('Options expression'),
      component: Group,
      entries: OptionsExpressionEntry({ ...context, id }),
    });
  }

  return groups;
}

// helpers //////////

function getValuesTooltip(translate) {
  return (
    translate('"Static" defines a constant, predefined set of form options.') +
    '\n\n' +
    translate(
      '"Input data" defines options that are populated dynamically, adjusting based on variable data for flexible responses to different conditions or inputs.',
    ) +
    '\n\n' +
    translate('"Expression" defines options that are populated from a FEEL expression.')
  );
}
