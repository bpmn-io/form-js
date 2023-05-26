import RenderInjector from './RenderInjector';
import TestInjection from './TestInjection';

export default {

  __init__: [ 'testInjection' ],

  // renderInjector: [ 'type', RenderInjector ],
  testInjection: [ 'type', TestInjection ]
};