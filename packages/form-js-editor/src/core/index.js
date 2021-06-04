import EventBus from './EventBus';
import Modeling from './Modeling';
import Selection from './Selection';
import DebounceFactory from './Debounce';
import FormFieldRegistry from './FormFieldRegistry';

import renderModule from '../render';

export default {
  __depends__: [ renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  modeling: [ 'type', Modeling ],
  selection: [ 'type', Selection ],
  debounce: [ 'factory', DebounceFactory ]
};