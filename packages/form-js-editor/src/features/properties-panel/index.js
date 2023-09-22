import PropertiesPanelModule from './PropertiesPanelRenderer';

import { FeelPopupModule } from '@bpmn-io/properties-panel';

export default {
  __depends__: [
    FeelPopupModule
  ],
  __init__: [ 'propertiesPanel' ],
  propertiesPanel: [ 'type', PropertiesPanelModule ]
};