import { zeroPositiveIntegerEntryFactory, simpleBoolEntryFactory } from './factories';

export default function RepeatableEntry(props) {
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
    zeroPositiveIntegerEntryFactory({
      id: 'defaultRepetitions',
      path: [ 'defaultRepetitions' ],
      label: 'Default number of items',
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
    const nonCollapseItemsEntry = zeroPositiveIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: [ 'nonCollapsedItems' ],
      label: 'Number of non-collapsing items',
      props
    });

    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}