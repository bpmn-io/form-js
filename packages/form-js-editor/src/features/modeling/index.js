import Modeling from './Modeling';

import behaviorModule from './behavior';
import commandModule from 'diagram-js/lib/command';

export default {
  __depends__: [
    behaviorModule,
    commandModule
  ],
  __init__: [ 'modeling' ],
  modeling: [ 'type', Modeling ]
};
