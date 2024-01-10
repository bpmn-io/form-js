import { EventBus } from './EventBus';
import { Validator } from './Validator';
import { Importer } from './Importer';
import { FieldFactory } from './FieldFactory';
import { PathRegistry } from './PathRegistry';
import { FormLayouter } from './FormLayouter';
import { FormFieldRegistry } from './FormFieldRegistry';

import { RenderModule } from '../render';

export { Importer, FieldFactory, FormFieldRegistry, PathRegistry, FormLayouter };

export const CoreModule = {
  __depends__: [ RenderModule ],
  eventBus: [ 'type', EventBus ],
  importer: [ 'type', Importer ],
  fieldFactory: [ 'type', FieldFactory ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  pathRegistry: [ 'type', PathRegistry ],
  formLayouter: [ 'type', FormLayouter ],
  validator: [ 'type', Validator ]
};