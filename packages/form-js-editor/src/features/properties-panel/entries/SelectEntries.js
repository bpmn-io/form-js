import { simpleBoolEntryFactory } from './factories';

export function SelectEntries(props) {
  const translate = props.getService('translate');
  const entries = [
    simpleBoolEntryFactory({
      id: 'searchable',
      path: ['searchable'],
      label: translate('Searchable'),
      props,
      isDefaultVisible: (field) => field.type === 'select',
    }),
  ];

  return entries;
}
