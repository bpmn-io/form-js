import { EndpointKeyEntry } from '../entries';

export function DownloadSettings(field, editField) {
  const entries = [...EndpointKeyEntry({ field, editField })];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'downloadSettings',
    label: 'Download settings',
    entries,
  };
}
