import { PropertiesPanel as BasePropertiesPanel } from '@bpmn-io/properties-panel';

import { useCallback, useLayoutEffect, useMemo, useState } from 'preact/hooks';

import { reduce, isArray } from 'min-dash';

import { getPropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import { useService } from './hooks';

const EMPTY = {};

export function PropertiesPanel() {
  const eventBus = useService('eventBus');
  const modeling = useService('modeling');
  const selection = useService('selection');
  const formEditor = useService('formEditor');
  const formFields = useService('formFields');
  const propertiesPanel = useService('propertiesPanel');
  const propertiesPanelConfig = useService('config.propertiesPanel') || EMPTY;

  const { feelPopupContainer } = propertiesPanelConfig;

  const [state, setState] = useState({ selectedFormField: selection.get() || formEditor._getState().schema });

  const selectedFormField = state.selectedFormField;

  const refresh = useCallback(
    (field) => {
      // TODO(skaiir): rework state management, re-rendering the whole properties panel is not the way to go
      // https://github.com/bpmn-io/form-js/issues/686
      setState({ selectedFormField: selection.get() || formEditor._getState().schema });

      // notify interested parties on property panel updates
      eventBus.fire('propertiesPanel.updated', {
        formField: field,
      });
    },
    [eventBus, formEditor, selection],
  );

  useLayoutEffect(() => {
    /**
     * TODO(pinussilvestrus): update with actual updated element,
     * once we have a proper updater/change support
     */
    eventBus.on('changed', refresh);
    eventBus.on('import.done', refresh);
    eventBus.on('selection.changed', refresh);

    return () => {
      eventBus.off('changed', refresh);
      eventBus.off('import.done', refresh);
      eventBus.off('selection.changed', refresh);
    };
  }, [eventBus, refresh]);

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [modeling]);

  // retrieve groups for selected form field
  const providers = propertiesPanel.getProviders();

  const groups = useMemo(() => {
    return reduce(
      providers,
      function (groups, provider) {
        // do not collect groups for multi element state
        if (isArray(selectedFormField)) {
          return [];
        }

        const updater = provider.getGroups(selectedFormField, editField);

        return updater(groups);
      },
      [],
    );
  }, [providers, selectedFormField, editField]);

  const PropertiesPanelHeaderProvider = useMemo(
    () =>
      getPropertiesPanelHeaderProvider({
        getDocumentationRef: propertiesPanelConfig.getDocumentationRef,
        formFields,
      }),
    [formFields, propertiesPanelConfig],
  );

  return (
    // eslint-disable-next-line react/no-unknown-property
    <div class="fjs-properties-container" input-handle-modified-keys="y,z">
      <div
        class="fjs-properties-panel"
        data-field={selectedFormField && selectedFormField.id}
        onFocusCapture={onFocus}
        onBlurCapture={onBlur}>
        <BasePropertiesPanel
          element={selectedFormField}
          eventBus={eventBus}
          groups={groups}
          headerProvider={PropertiesPanelHeaderProvider}
          placeholderProvider={PropertiesPanelPlaceholderProvider}
          feelPopupContainer={feelPopupContainer}
        />
      </div>
    </div>
  );
}
