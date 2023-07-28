import { PropertiesPanel } from '@bpmn-io/properties-panel';

import {
  useCallback,
  useState,
  useLayoutEffect
} from 'preact/hooks';

import { FormPropertiesPanelContext } from './context';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import {
  ConditionGroup,
  AppearanceGroup,
  CustomPropertiesGroup,
  GeneralGroup,
  SerializationGroup,
  ConstraintsGroup,
  ValidationGroup,
  ValuesGroups,
  LayoutGroup
} from './groups';

function getGroups(field, editField, getService) {

  if (!field) {
    return [];
  }

  const groups = [
    GeneralGroup(field, editField, getService),
    ConditionGroup(field, editField),
    LayoutGroup(field, editField),
    AppearanceGroup(field, editField),
    SerializationGroup(field, editField),
    ...ValuesGroups(field, editField),
    ConstraintsGroup(field, editField),
    ValidationGroup(field, editField),
    CustomPropertiesGroup(field, editField)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default function FormPropertiesPanel(props) {
  const {
    eventBus,
    injector
  } = props;

  const formEditor = injector.get('formEditor');
  const modeling = injector.get('modeling');
  const selectionModule = injector.get('selection');

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

  return (
    <div
      class="fjs-properties-panel"
      data-field={ selectedFormField && selectedFormField.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <FormPropertiesPanelContext.Provider value={ propertiesPanelContext }>
        <PropertiesPanel
          element={ selectedFormField }
          eventBus={ eventBus }
          groups={ getGroups(selectedFormField, editField, getService) }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
        />
      </FormPropertiesPanelContext.Provider>
    </div>
  );
}