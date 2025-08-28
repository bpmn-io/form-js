import { HeightEntry } from './HeightEntry';

export function IFrameHeightEntry(props) {
  const translate = props.getService('translate');

  return [
    ...HeightEntry({
      ...props,
      description: translate('IFrame height description'),
      isDefaultVisible: (field) => field.type === 'iframe',
    }),
  ];
}
