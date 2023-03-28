import EventBus from './EventBus';
import Validator from './Validator';
import FormFieldRegistry from './FormFieldRegistry';
import FormLayouter from './FormLayouter';

import importModule from '../import';
import renderModule from '../render';

export { FormFieldRegistry, FormLayouter };

export default {
  __depends__: [ importModule, renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  formLayouter: [ 'type', FormLayouter ],
  validator: [ 'type', Validator ]
};