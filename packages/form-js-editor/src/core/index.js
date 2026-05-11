import { FieldFactory, Importer, PathRegistry } from '@bpmn-io/form-js-viewer';

import { EventBus } from './EventBus';
import { DebounceFactory } from './Debounce';
import { FormFieldRegistry } from './FormFieldRegistry';
import { FormLayouter } from './FormLayouter';
import { FormLayoutValidator } from './FormLayoutValidator';

import { RenderModule } from '../render';
import { CustomTranslateModule } from '../features/customTranslate/customTranslate';

export const CoreModule = {
  __depends__: [RenderModule, CustomTranslateModule],
  debounce: ['factory', DebounceFactory],
  eventBus: ['type', EventBus],
  importer: ['type', Importer],
  formFieldRegistry: ['type', FormFieldRegistry],
  pathRegistry: ['type', PathRegistry],
  formLayouter: ['type', FormLayouter],
  formLayoutValidator: ['type', FormLayoutValidator],
  fieldFactory: ['type', FieldFactory],
};
