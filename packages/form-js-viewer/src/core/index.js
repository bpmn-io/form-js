import EventBus from './EventBus';
import Validator from './Validator';
import FormFieldRegistry from './FormFieldRegistry';

import renderModule from '../render';

export default {
  __depends__: [ renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  validator: [ 'type', Validator ]
};