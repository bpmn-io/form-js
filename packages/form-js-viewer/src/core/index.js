import EventBus from './EventBus';
import Validator from './Validator';
import Importer from './Importer';
import FieldFactory from './FieldFactory';
import FormFieldRegistry from './FormFieldRegistry';
import FormLayouter from './FormLayouter';

import renderModule from '../render';

export { Importer, FieldFactory, FormFieldRegistry, FormLayouter };

export default {
  __depends__: [ renderModule ],
  eventBus: [ 'type', EventBus ],
  importer: [ 'type', Importer ],
  fieldFactory: [ 'type', FieldFactory ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  formLayouter: [ 'type', FormLayouter ],
  validator: [ 'type', Validator ]
};