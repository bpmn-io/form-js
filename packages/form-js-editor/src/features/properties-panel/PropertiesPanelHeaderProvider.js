import { iconsByType } from '../../render/components/icons';
import { getPaletteIcon } from '../palette/components/Palette';

export function getPropertiesPanelHeaderProvider(options = {}) {
  const { getDocumentationRef, formFields } = options;

  return {
    getElementLabel: (field) => {
      const { type } = field;
      const fieldDefinition = formFields.get(type).config;
      return fieldDefinition.getSubheading ? fieldDefinition.getSubheading(field) : field.label;
    },

    getElementIcon: (field) => {
      const { type } = field;
      const fieldDefinition = formFields.get(type).config;
      const Icon = fieldDefinition.icon || iconsByType(type);
      if (Icon) {
        return function IconComponent() {
          return <Icon width="36" height="36" viewBox="0 0 54 54" />;
        };
      } else if (fieldDefinition.iconUrl) {
        return getPaletteIcon({ iconUrl: fieldDefinition.iconUrl, label: fieldDefinition.label });
      }
    },

    getTypeLabel: (field) => {
      const { type } = field;
      if (type === 'default') {
        return 'Form';
      }
      const fieldDefinition = formFields.get(type).config;
      return fieldDefinition.name || fieldDefinition.label || type;
    },

    getDocumentationRef,
  };
}
