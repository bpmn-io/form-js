import { PropertiesPanel } from '@bpmn-io/properties-panel';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import {
  CustomValuesGroup,
  GeneralGroup,
  ValidationGroup,
  ValuesGroups
} from './groups';

import {
  useService
} from '../../hooks';

function getGroups(field, editField) {

  if (!field) {
    return [];
  }

  const groups = [
    GeneralGroup(field, editField),
    ...ValuesGroups(field, editField),
    ValidationGroup(field, editField),
    CustomValuesGroup(field, editField)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default function FormPropertiesPanel(props) {
  const {
    editField,
    field
  } = props;

  const eventBus = useService('eventBus');

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  return (
    <div
      class="fjs-properties-panel"
      data-field={ field && field.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <PropertiesPanel
        element={ field }
        eventBus={ eventBus }
        groups={ getGroups(field, editField) }
        headerProvider={ PropertiesPanelHeaderProvider }
        placeholderProvider={ PropertiesPanelPlaceholderProvider }
      />
    </div>
  );
}