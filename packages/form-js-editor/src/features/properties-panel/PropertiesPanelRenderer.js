import { SectionModuleBase } from '../SectionModuleBase';

export class PropertiesPanelRenderer extends SectionModuleBase {
  constructor(eventBus) { super(eventBus, 'propertiesPanel'); }
}

PropertiesPanelRenderer.$inject = [ 'eventBus' ];