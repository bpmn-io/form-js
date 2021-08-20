import EventBus from './EventBus';
import DebounceFactory from './Debounce';
import FieldFactory from './FieldFactory';
import FormFieldRegistry from './FormFieldRegistry';

import importModule from '../import';
import renderModule from '../render';

export default {
  __depends__: [
    importModule,
    renderModule
  ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  fieldFactory: [ 'type', FieldFactory ],
  debounce: [ 'factory', DebounceFactory ]
};