import commandModule from 'diagram-js/lib/command';

import ViewerCommands from './ViewerCommands';

export default {
  __depends__: [
    commandModule
  ],
  __init__: [ 'viewerCommands' ],
  viewerCommands: [ 'type', ViewerCommands ]
};

export { ViewerCommands };