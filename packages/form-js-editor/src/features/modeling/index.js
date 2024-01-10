import commandModule from 'diagram-js/lib/command';

import { BehaviorModule } from './behavior';
import { FormLayoutUpdater } from './FormLayoutUpdater';
import { Modeling } from './Modeling';

export const ModelingModule = {
  __depends__: [
    BehaviorModule,
    commandModule
  ],
  __init__: [ 'formLayoutUpdater', 'modeling' ],
  formLayoutUpdater: [ 'type', FormLayoutUpdater ],
  modeling: [ 'type', Modeling ]
};
