import {
  textToLabel
} from './Util';

import { iconsByType } from '../../render/components/icons';

import { getPaletteIcon } from '../palette/components/Palette';

import { useService } from './hooks';

const headerlessTypes = [
  'spacer',
  'separator',
  'expression',
  'html'
];

export const PropertiesPanelHeaderProvider = {

  getElementLabel: (field) => {
    const {
      type
    } = field;

    if (headerlessTypes.includes(type)) {
      return '';
    }

    if (type === 'text') {
      return textToLabel(field.text);
    }

    if (type === 'image') {
      return field.alt;
    }

    if (type === 'default') {
      return field.id;
    }

    return field.label;
  },

  getElementIcon: (field) => {
    const {
      type
    } = field;

    // @Note: We know that we are inside the properties panel context,
    // so we can savely use the hook here.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fieldDefinition = useService('formFields').get(type).config;

    const Icon = fieldDefinition.icon || iconsByType(type);

    if (Icon) {
      return () => <Icon width="36" height="36" viewBox="0 0 54 54" />;
    } else if (fieldDefinition.iconUrl) {
      return getPaletteIcon({ iconUrl: fieldDefinition.iconUrl, label: fieldDefinition.label });
    }
  },

  getTypeLabel: (field) => {
    const {
      type
    } = field;

    if (type === 'default') {
      return 'Form';
    }

    // @Note: We know that we are inside the properties panel context,
    // so we can savely use the hook here.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fieldDefinition = useService('formFields').get(type).config;

    return fieldDefinition.label || type;
  }
};