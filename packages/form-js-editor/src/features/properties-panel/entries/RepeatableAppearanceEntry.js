import { simpleBoolEntryFactory, zeroPositiveIntegerEntryFactory } from './factories';

export default function RepeatableDefaultEntry(props) {
  const {
    field,
    getService
  } = props;

  const formFields = getService('formFields');
  const config = formFields.get(field.type).config;

  if (!config.repeatable) {
    return [];
  }

  const entries = [
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

    // @ts-ignore
    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}