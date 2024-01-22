import { simpleRangeIntegerEntryFactory, simpleBoolEntryFactory } from './factories';

export function RepeatableEntry(props) {
  const {
    field,
    getService
  } = props;

  const {
    type
  } = field;

  const formFieldDefinition = getService('formFields').get(type);

  if (!formFieldDefinition || !formFieldDefinition.config.repeatable) {
    return [];
  }

  const entries = [
    simpleRangeIntegerEntryFactory({
      id: 'defaultRepetitions',
      path: [ 'defaultRepetitions' ],
      label: 'Default number of items',
      min: 1,
      max: 20,
      props
    }),
    simpleBoolEntryFactory({
      id: 'allowAddRemove',
      path: [ 'allowAddRemove' ],
      label: 'Allow add/delete items',
      props
    }),
    simpleBoolEntryFactory({
      id: 'disableCollapse',
      path: [ 'disableCollapse' ],
      label: 'Disable collapse',
      props
    })
  ];

  if (!field.disableCollapse) {
    const nonCollapseItemsEntry = simpleRangeIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: [ 'nonCollapsedItems' ],
      label: 'Number of non-collapsing items',
      min: 1,
      defaultValue: 5,
      props
    });

    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}