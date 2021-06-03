import EventBus from 'diagram-js/lib/core/EventBus';
import Validator from './Validator';

import renderModule from '../render';

export default {
  __depends__: [ renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', Map ],
  validator: [ 'type', Validator ]
};