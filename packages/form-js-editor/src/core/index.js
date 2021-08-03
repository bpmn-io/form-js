import EventBus from './EventBus';
import Modeling from './Modeling';
import DebounceFactory from './Debounce';
import { FormFieldRegistry } from '@bpmn-io/form-js-viewer';
import FieldFactory from './FieldFactory';

import commandModule from 'diagram-js/lib/command';
import importModule from '../import';
import renderModule from '../render';

export default {
  __depends__: [ commandModule, importModule, renderModule ],
  __init__: [ 'modeling' ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  fieldFactory: [ 'type', FieldFactory ],
  modeling: [ 'type', Modeling ],
  debounce: [ 'factory', DebounceFactory ]
};