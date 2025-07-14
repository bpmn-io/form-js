import { PropertiesPanel } from '@bpmn-io/properties-panel';
import { FormPropertiesPanelContext } from '../../../../../src/features/properties-panel/context';
import { createMockInjector } from '../../../../helper/mocks';

// to delete once we have unified the context of the properties panel and editors
export const MockPropertiesPanelContext = (props) => {
  const { options = {}, services = {} } = props;

  const propertiesPanelContext = {
    getService: (type, strict) => createMockInjector(services, options).get(type, strict),
  };

  return (
    <FormPropertiesPanelContext.Provider value={propertiesPanelContext}>
      {props.children}
    </FormPropertiesPanelContext.Provider>
  );
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

// helpers //////////////////////

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
