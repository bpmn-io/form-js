import { RenderInjector } from './RenderInjector';
import { SlotFillManager } from './SlotFillManager';

export const RenderInjectionModule = {
  __init__: ['renderInjector', 'slotFillManager'],
  renderInjector: ['type', RenderInjector],
  slotFillManager: ['type', SlotFillManager],
};
