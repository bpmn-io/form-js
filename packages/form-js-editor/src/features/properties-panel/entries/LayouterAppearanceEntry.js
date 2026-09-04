import { simpleSelectEntryFactory } from './factories';

export function LayouterAppearanceEntry(props) {
  const { field } = props;

  const translate = props.translate;
  if (!['group', 'dynamiclist'].includes(field.type)) {
    return [];
  }

  const entries = [
    simpleSelectEntryFactory({
      id: 'verticalAlignment',
      path: ['verticalAlignment'],
      label: translate('Vertical alignment'),
      optionsArray: [
        { value: 'start', label: translate('Top') },
        { value: 'center', label: translate('Center') },
        { value: 'end', label: translate('Bottom') },
      ],
      props,
    }),
  ];

  return entries;
}
