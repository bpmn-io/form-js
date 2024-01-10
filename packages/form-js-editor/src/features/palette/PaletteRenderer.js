import { SectionModuleBase } from '../SectionModuleBase';

export class PaletteRenderer extends SectionModuleBase {
  constructor(eventBus) { super(eventBus, 'palette'); }
}

PaletteRenderer.$inject = [ 'eventBus' ];