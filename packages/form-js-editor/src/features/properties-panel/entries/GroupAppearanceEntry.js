import { simpleBoolEntryFactory } from './factories';

export function GroupAppearanceEntry(props) {
  const { field, translate } = props;

  const { type } = field;

  if (!['group', 'dynamiclist'].includes(type)) {
    return [];
  }

  const entries = [
    simpleBoolEntryFactory({
      id: 'showOutline',
      path: ['showOutline'],
      label: translate('Show outline'),
      isTrueDefault: true,
      props,
    }),
  ];

  return entries;
}
