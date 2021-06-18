import EventBus from './EventBus';
import Modeling from './Modeling';
import Selection from './Selection';
import DebounceFactory from './Debounce';
import FormFieldRegistry from './FormFieldRegistry';

import commandModule from 'diagram-js/lib/command';
import importModule from '../import';
import renderModule from '../render';

export default {
  __depends__: [ commandModule, importModule, renderModule ],
  __init__: [ 'modeling' ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  modeling: [ 'type', Modeling ],
  selection: [ 'type', Selection ],
  debounce: [ 'factory', DebounceFactory ]
};