import { zeroPositiveIntegerEntryFactory } from './factories';

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
    zeroPositiveIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: [ 'nonCollapsedItems' ],
      label: 'Number of non-collapsing items',
      props
    })
  ];

  return entries;
}