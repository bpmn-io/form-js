import PropertiesPanelModule from './PropertiesPanelRenderer';
import PropertiesProvider from './PropertiesProvider';

import { FeelPopupModule } from '@bpmn-io/properties-panel';

export default {
  __depends__: [
    FeelPopupModule
  ],
  __init__: [ 'propertiesPanel', 'propertiesProvider' ],
  propertiesPanel: [ 'type', PropertiesPanelModule ],
  propertiesProvider: [ 'type', PropertiesProvider ]
};