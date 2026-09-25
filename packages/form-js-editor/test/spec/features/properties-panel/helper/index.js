import { PropertiesPanel } from '@bpmn-io/properties-panel';
import { act, render } from '@testing-library/preact/pure';

import { FormEditorContext } from '../../../../../src/render/context';
import { PropertiesProvider } from '../../../../../src/features/properties-panel/PropertiesProvider';
import { PropertiesPanel as FormPropertiesPanel } from '../../../../../src/features/properties-panel/PropertiesPanel';
import { EventBusMock, PropertiesPanelMock, createMockInjector } from '../../../../helper/mocks';

// to delete once we have unified the context of the properties panel and editors
export const MockPropertiesPanelContext = (props) => {
  const { options = {}, services = {} } = props;

  const propertiesPanelContext = {
    getService: (type, strict) => createMockInjector(services, options).get(type, strict),
  };

  return <FormEditorContext.Provider value={propertiesPanelContext}>{props.children}</FormEditorContext.Provider>;
};

const noop = () => {};

const noopField = {
  id: 'foobar',
  type: 'default',
};

const noopHeaderProvider = {
  getElementLabel: noop,
  getElementIcon: noop,
  getTypeLabel: noop,
};

// recent versions of the properties panel (between 3.26.3 -> 3.30.2) fire certain eventbus events on unmount causing test failures, this silences them
const noopEventBus = {
  on: noop,
  off: noop,
  once: noop,
  fire: noop,
};

export const TestPropertiesPanel = (props) => {
  const { field = noopField, headerProvider = noopHeaderProvider } = props;

  let { groups = [] } = props;

  groups = applyDefaultVisible(field, groups);

  return <PropertiesPanel element={field} groups={groups} headerProvider={headerProvider} eventBus={noopEventBus} />;
};

export function createPropertiesPanel({ services, ...restOptions } = {}, renderFn = render) {
  const options = {
    editField: () => {},
    isTemplate: () => false,
    evaluateTemplate: (value) => `Evaluation of "${value}"`,
    valuePaths: {},
    claimedPaths: [],
    propertiesProviders: [],
    field: null,
    ...restOptions,
  };

  const defaultedServices = {
    eventBus: new EventBusMock(),
    propertiesPanel: new PropertiesPanelMock(),
    modeling: {
      editFormField(...args) {
        return options.editField(...args);
      },
    },
    ...services,
  };

  const injector = createMockInjector(defaultedServices, options);

  const container = options.container;

  const providers = [
    new PropertiesProvider(defaultedServices.propertiesPanel, injector),
    ...options.propertiesProviders,
  ];

  // the reactive properties panel retrieves its providers from the propertiesPanel service,
  // which collects them into a new array on every call
  defaultedServices.propertiesPanel.getProviders = () => [...providers];

  return renderFn(
    <FormEditorContext.Provider value={{ getService: (type, strict) => injector.get(type, strict) }}>
      <FormPropertiesPanel />
    </FormEditorContext.Provider>,
    {
      container,
    },
  );
}

export function findGroup(container, groupLabel) {
  let groups = container.querySelectorAll('.bio-properties-panel-group');
  const groupIndex = findGroupIndex(container, groupLabel);

  if (groupIndex >= 0) {
    return groups[groupIndex];
  }
}

// advances the event loop one tick inside act, flushing deferred (setTimeout)
// work and the resulting renders before we assert
export function nextTick() {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
  });
}

// helpers //////////////////////

function findGroupIndex(container, groupLabel) {
  const groupLabels = container.querySelectorAll('.bio-properties-panel-group-header-title');
  return Array.from(groupLabels).findIndex((group) => group.textContent === groupLabel);
}

function applyDefaultVisible(field, groups) {
  groups.forEach((group) => {
    const { entries } = group;

    if (!entries || !entries.length) {
      return true;
    }

    group.entries = entries.filter((entry) => {
      const { isDefaultVisible } = entry;

      if (!isDefaultVisible) {
        return true;
      }

      return isDefaultVisible(field);
    });
  });

  return groups.filter((group) => group.entries && group.entries.length);
}
