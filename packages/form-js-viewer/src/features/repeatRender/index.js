import { RepeatRenderManager } from './RepeatRenderManager';
import { FileRegistry } from '../../render/FileRegistry';

export const RepeatRenderModule = {
  __init__: ['repeatRenderManager'],
  repeatRenderManager: ['type', RepeatRenderManager],
  fileRegistry: ['type', FileRegistry],
};

export { RepeatRenderManager };
