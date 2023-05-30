import SectionModuleBase from '../SectionModuleBase';

export default class PaletteModule extends SectionModuleBase {
  constructor(eventBus) { super(eventBus, 'palette'); }
}

PaletteModule.$inject = [ 'eventBus' ];