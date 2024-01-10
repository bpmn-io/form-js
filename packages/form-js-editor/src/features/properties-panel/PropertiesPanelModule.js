import { SectionModuleBase } from '../SectionModuleBase';

export class PropertiesPanelModule extends SectionModuleBase {
  constructor(eventBus) { super(eventBus, 'propertiesPanel'); }
}

PropertiesPanelModule.$inject = [ 'eventBus' ];