import { PropertiesPanel as BasePropertiesPanel } from '@bpmn-io/properties-panel';

import {
  useCallback,
  useMemo,
} from 'preact/hooks';

import { reduce, isArray } from 'min-dash';
import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';
import { useService } from './hooks';

export function PropertiesPanel() {

  const eventBus = useService('eventBus');
  const modeling = useService('modeling');
  const selection = useService('selection');
  const formEditor = useService('formEditor');
  const propertiesPanelConfig = useService('config.propertiesPanel') || {};
  const propertiesProviderRegistry = useService('propertiesProviderRegistry');

  const {
    feelPopupContainer
  } = propertiesPanelConfig;

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [ modeling ]);

  const selectedFormField = selection.get() || formEditor._getState().schema;

  const providers = useMemo(() => {
    return propertiesProviderRegistry.getProviders(selectedFormField);
  }, [ propertiesProviderRegistry, selectedFormField ]);

  const groups = useMemo(() => {
    return reduce(providers, function(groups, provider) {

      // do not collect groups for multi element state
      if (isArray(selectedFormField)) {
        return [];
      }

      const updater = provider.getGroups(selectedFormField, editField);

      return updater(groups);
    }, []);
  }, [ providers, selectedFormField, editField ]);

  return (
    <div class="fjs-properties-container" input-handle-modified-keys="y,z">
      <div
        class="fjs-properties-panel"
        data-field={ selectedFormField && selectedFormField.id }
        onFocusCapture={ onFocus }
        onBlurCapture={ onBlur }
      >
        <BasePropertiesPanel
          element={ selectedFormField }
          eventBus={ eventBus }
          groups={ groups }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
          feelPopupContainer={ feelPopupContainer }
        />
      </div>
    </div>
  );
}