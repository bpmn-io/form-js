import { simpleRangeIntegerEntryFactory, simpleBoolEntryFactory } from './factories';

export function RepeatableEntry(props) {
  const { field, getService } = props;

  const { type } = field;

  const formFieldDefinition = getService('formFields').get(type);
  const translate = getService('translate');

  if (!formFieldDefinition || !formFieldDefinition.config.repeatable) {
    return [];
  }

  const entries = [
    simpleRangeIntegerEntryFactory({
      id: 'defaultRepetitions',
      path: ['defaultRepetitions'],
      label: translate('Default number of items'),
      min: 1,
      max: 100,
      props,
    }),
    simpleBoolEntryFactory({
      id: 'allowAddRemove',
      path: ['allowAddRemove'],
      label: translate('Allow add/delete items'),
      props,
    }),
    simpleBoolEntryFactory({
      id: 'disableCollapse',
      path: ['disableCollapse'],
      label: translate('Disable collapse'),
      props,
    }),
  ];

  if (!field.disableCollapse) {
    const nonCollapseItemsEntry = simpleRangeIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: ['nonCollapsedItems'],
      label: translate('Number non-collapsing'),
      min: 1,
      defaultValue: 5,
      props,
    });

    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}
