import RenderInjector from './RenderInjector';
import TestInjection from './TestInjection';

export default {
  __init__: [ 'renderInjector', 'testInjection' ],
  renderInjector: [ 'type', RenderInjector ],
  testInjection: [ 'type', TestInjection ]
};