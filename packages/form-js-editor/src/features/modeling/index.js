import Modeling from './Modeling';

import FormLayoutUpdater from './FormLayoutUpdater';

import behaviorModule from './behavior';
import commandModule from 'diagram-js/lib/command';

export default {
  __depends__: [
    behaviorModule,
    commandModule
  ],
  __init__: [ 'formLayoutUpdater', 'modeling' ],
  formLayoutUpdater: [ 'type', FormLayoutUpdater ],
  modeling: [ 'type', Modeling ]
};
