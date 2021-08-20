import Modeling from './Modeling';

import commandModule from 'diagram-js/lib/command';

export default {
  __depends__: [
    commandModule
  ],
  __init__: [ 'modeling' ],
  modeling: [ 'type', Modeling ]
};
