import { PropertiesPanel } from '@bpmn-io/properties-panel';

import {
  useCallback,
  useState,
  useLayoutEffect,
  useMemo
} from 'preact/hooks';

import { useService } from './hooks';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import {
  ConditionGroup,
  AppearanceGroup,
  CustomValuesGroup,
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
    CustomValuesGroup(field, editField)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default function FormPropertiesPanel() {

  const injector = useService('injector');
  const eventBus = useService('eventBus');
  const formEditor = useService('formEditor');
  const modeling = useService('modeling');
  const selection = useService('selection');

  const { schema } = formEditor._getState();

  const [ state, setState ] = useState({
    selectedFormField: selection.get() || schema
  });

  const _update = (field) => {

    setState({
      ...state,
      selectedFormField: field
    });

    // notify interested parties on property panel updates
    eventBus.fire('propertiesPanel.updated', {
      formField: field
    });
  };

  useLayoutEffect(() => {
    function onSelectionChange(event) {
      _update(event.selection || schema);
    }

    eventBus.on('selection.changed', onSelectionChange);

    return () => {
      eventBus.off('selection.changed', onSelectionChange);
    };
  }, []);

  useLayoutEffect(() => {
    const onFieldChanged = () => {

      /**
       * TODO(pinussilvestrus): update with actual updated element,
       * once we have a proper updater/change support
       */
      _update(selection.get() || schema);
    };

    eventBus.on('changed', onFieldChanged);

    return () => {
      eventBus.off('changed', onFieldChanged);
    };
  }, []);

  const selectedFormField = state.selectedFormField;

  const getService = useCallback((type, strict = true) => injector.get(type, strict), [ injector ]);

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [ modeling ]);

  const groups = useMemo(() => getGroups(selectedFormField, editField, getService), [ editField, getService, selectedFormField ]);

  return (
    <div
      class="fjs-properties-panel"
      data-field={ selectedFormField && selectedFormField.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <PropertiesPanel
        element={ selectedFormField }
        eventBus={ eventBus }
        groups={ groups }
        headerProvider={ PropertiesPanelHeaderProvider }
        placeholderProvider={ PropertiesPanelPlaceholderProvider }
      />
    </div>
  );
}