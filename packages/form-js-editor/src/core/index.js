import EventBus from './EventBus';
import DebounceFactory from './Debounce';
import FieldFactory from './FieldFactory';
import FormFieldRegistry from './FormFieldRegistry';
import FormLayouter from './FormLayouter';
import FormLayoutValidator from './FormLayoutValidator';

import importModule from '../import';
import renderModule from '../render';

export default {
  __depends__: [
    importModule,
    renderModule
  ],
  debounce: [ 'factory', DebounceFactory ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  formLayouter: [ 'type', FormLayouter ],
  formLayoutValidator: [ 'type', FormLayoutValidator ],
  fieldFactory: [ 'type', FieldFactory ]
};