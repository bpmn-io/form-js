import SectionModuleBase from '../SectionModuleBase';

export default class PropertiesPanelModule extends SectionModuleBase {
  constructor(eventBus) { super(eventBus, 'propertiesPanel'); }
}

PropertiesPanelModule.$inject = [ 'eventBus' ];