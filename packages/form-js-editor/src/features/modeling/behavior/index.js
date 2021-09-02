import IdBehavior from './IdBehavior';
import KeyBehavior from './KeyBehavior';

export default {
  __init__: [
    'idBehavior',
    'keyBehavior'
  ],
  idBehavior: [ 'type', IdBehavior ],
  keyBehavior: [ 'type', KeyBehavior ]
};
