import {
  textToLabel
} from './Util';

import { iconsByType } from '../../render/components/icons';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  checklist: 'CHECKLIST',
  columns: 'COLUMNS',
  default: 'FORM',
  datetime: 'DATETIME',
  image: 'IMAGE VIEW',
  number: 'NUMBER',
  radio: 'RADIO',
  select: 'SELECT',
  taglist: 'TAGLIST',
  text: 'TEXT VIEW',
  textfield: 'TEXT FIELD',
  textarea: 'TEXT AREA',
};

export const PropertiesPanelHeaderProvider = {

  getElementLabel: (field) => {
    const {
      type
    } = field;

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

    const Icon = iconsByType(type);

    if (Icon) {
      return () => <Icon width="36" height="36" viewBox="0 0 54 54" />;
    }
  },

  getTypeLabel: (field) => {
    const {
      type
    } = field;

    return labelsByType[type];
  }
};