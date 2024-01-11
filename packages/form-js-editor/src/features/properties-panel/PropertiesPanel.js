import { PropertiesPanel as BasePropertiesPanel } from '@bpmn-io/properties-panel';

import {
  useCallback,
  useMemo,
  useState,
  useLayoutEffect
} from 'preact/hooks';

import { reduce, isArray } from 'min-dash';

import { FormPropertiesPanelContext } from './context';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

export function PropertiesPanel(props) {
  const {
    eventBus,
    getProviders,
    injector
  } = props;

  const formEditor = injector.get('formEditor');
  const modeling = injector.get('modeling');
  const selectionModule = injector.get('selection');
  const propertiesPanelConfig = injector.get('config.propertiesPanel') || {};

  const {
    feelPopupContainer
  } = propertiesPanelConfig;

  const [ state , setState ] = useState({ selectedFormField: selectionModule.get() || formEditor._getState().schema });

  const selectedFormField = state.selectedFormField;

  const refresh = useCallback((field) => {

    // TODO(skaiir): rework state management, re-rendering the whole properties panel is not the way to go
    // https://github.com/bpmn-io/form-js/issues/686
    setState({ selectedFormField: selectionModule.get() || formEditor._getState().schema });

    // notify interested parties on property panel updates
    eventBus.fire('propertiesPanel.updated', {
      formField: field
    });

  }, [ eventBus, formEditor, selectionModule ]);


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
  }, [ eventBus, refresh ]);

  const getService = (type, strict = true) => injector.get(type, strict);

  const propertiesPanelContext = { getService };

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [ modeling ]);

  // retrieve groups for selected form field
  const providers = getProviders(selectedFormField);

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
    <div
      class="fjs-properties-panel"
      data-field={ selectedFormField && selectedFormField.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <FormPropertiesPanelContext.Provider value={ propertiesPanelContext }>
        <BasePropertiesPanel
          element={ selectedFormField }
          eventBus={ eventBus }
          groups={ groups }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
          feelPopupContainer={ feelPopupContainer }
        />
      </FormPropertiesPanelContext.Provider>
    </div>
  );
}