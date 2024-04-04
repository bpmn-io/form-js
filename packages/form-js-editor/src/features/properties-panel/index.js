import { PropertiesPanelRenderer } from './PropertiesPanelRenderer';
import { PropertiesProviderRegistry } from './PropertiesProviderRegistry';
import { PropertiesProvider } from './PropertiesProvider';

import { FeelPopupModule } from '@bpmn-io/properties-panel';

export const PropertiesPanelModule = {
  __depends__: [
    FeelPopupModule
  ],
  __init__: [ 'propertiesPanel', 'propertiesProvider' ],
  propertiesPanel: [ 'type', PropertiesPanelRenderer ],
  propertiesProvider: [ 'type', PropertiesProvider ],
  propertiesProviderRegistry: [ 'type', PropertiesProviderRegistry ]
};