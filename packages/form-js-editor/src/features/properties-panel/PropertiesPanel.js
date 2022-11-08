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
  CustomValuesGroup,
  GeneralGroup,
  DisplayGroup,
  FormatGroup,
  ConstraintsGroup,
  ImageGroup,
  InteractionGroup,
  ValidationGroup,
  ValuesGroups
} from './groups';

function getGroups(field, editField) {

  if (!field) {
    return [];
  }

  const groups = [
    GeneralGroup(field, editField),
    ConditionGroup(field, editField),
    DisplayGroup(field, editField),
    InteractionGroup(field, editField),
    FormatGroup(field, editField),
    ...ValuesGroups(field, editField),
    ConstraintsGroup(field, editField),
    ValidationGroup(field, editField),
    ImageGroup(field, editField),
    CustomValuesGroup(field, editField)
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
  const selection = injector.get('selection');

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

  const propertiesPanelContext = {
    getService(type, strict = true) {
      return injector.get(type, strict);
    }
  };

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
          groups={ getGroups(selectedFormField, editField) }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
        />
      </FormPropertiesPanelContext.Provider>
    </div>
  );
}