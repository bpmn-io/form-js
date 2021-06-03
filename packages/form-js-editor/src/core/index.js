import EventBus from 'diagram-js/lib/core/EventBus';
import Modeling from './Modeling';
import Selection from './Selection';
import DebounceFactory from './Debounce';

import renderModule from '../render';

export default {
  __depends__: [ renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', Map ],
  modeling: [ 'type', Modeling ],
  selection: [ 'type', Selection ],
  debounce: [ 'factory', DebounceFactory ]
};