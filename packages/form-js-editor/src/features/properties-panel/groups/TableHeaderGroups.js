import { get, isArray } from 'min-dash';

import { ColumnsExpressionEntry, HeadersSourceSelectEntry, StaticColumnsSourceEntry } from '../entries';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

export function TableHeaderGroups(field, editField, getService) {
  const { type, id: fieldId } = field;

  const translate = getService('translate');

  if (type !== 'table') {
    return [];
  }

  const areStaticColumnsEnabled = isArray(get(field, ['columns']));

  /**
   * @type {Array<Group>}
   */
  const groups = [
    {
      id: `${fieldId}-columnsSource`,
      label: translate('Headers source'),
      tooltip: translate('Headers source tooltip'),
      component: Group,
      entries: [
        ...HeadersSourceSelectEntry({ field, editField, translate }),
        ...ColumnsExpressionEntry({ field, editField }),
      ],
    },
  ];

  if (areStaticColumnsEnabled) {
    const id = `${fieldId}-columns`;

    groups.push({
      id,
      label: 'Header items',
      component: (props) => ListGroup({ ...props, translate }),
      ...StaticColumnsSourceEntry({ field, editField, id }),
    });
  }

  return groups;
}

// helpers //////////
