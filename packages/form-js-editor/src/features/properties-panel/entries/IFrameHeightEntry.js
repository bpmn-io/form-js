import HeightEntry from './HeightEntry';

export default function IFrameHeightEntry(props) {
  return [
    ...HeightEntry({
      ...props,
      description: 'Height of the container in pixels.',
      isDefaultVisible: (field) => field.type === 'iframe'
    })
  ];
}