import {
  ConditionGroup,
  AppearanceGroup,
  CustomPropertiesGroup,
  GeneralGroup,
  SerializationGroup,
  ConstraintsGroup,
  ValidationGroup,
  OptionsGroups,
  TableHeaderGroups,
  LayoutGroup,
  SecurityAttributesGroup
} from './groups';

import { hasEntryConfigured } from './Util';

export class PropertiesProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }

  _filterVisibleEntries(groups, field, getService) {
    return groups.forEach(group => {
      const {
        entries
      } = group;

      const {
        type
      } = field;

      const formFields = getService('formFields');

      const fieldDefinition = formFields.get(type).config;

      if (!entries) {
        return;
      }

      group.entries = entries.filter(entry => {
        const {
          isDefaultVisible
        } = entry;

        if (!isDefaultVisible) {
          return true;
        }

        return isDefaultVisible(field) || hasEntryConfigured(fieldDefinition, entry.id);
      });
    });
  }

  getGroups(field, editField) {
    return (groups) => {
      if (!field) {
        return groups;
      }

      const getService = (type, strict = true) => this._injector.get(type, strict);

      groups = [
        ...groups,
        GeneralGroup(field, editField, getService),
        ...OptionsGroups(field, editField, getService),
        ...TableHeaderGroups(field, editField),
        SecurityAttributesGroup(field, editField),
        ConditionGroup(field, editField),
        LayoutGroup(field, editField),
        AppearanceGroup(field, editField),
        SerializationGroup(field, editField),
        ConstraintsGroup(field, editField),
        ValidationGroup(field, editField),
        CustomPropertiesGroup(field, editField)
      ].filter(group => group != null);

      this._filterVisibleEntries(groups, field, getService);

      // contract: if a group has no entries or items, it should not be displayed at all
      return groups.filter(group => {
        return group.items || group.entries && group.entries.length;
      });
    };
  }
}

PropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];