import IdBehavior from './IdBehavior';
import KeyBehavior from './KeyBehavior';
import ValidateBehavior from './ValidateBehavior';

export default {
  __init__: [
    'idBehavior',
    'keyBehavior',
    'validateBehavior'
  ],
  idBehavior: [ 'type', IdBehavior ],
  keyBehavior: [ 'type', KeyBehavior ],
  validateBehavior: [ 'type', ValidateBehavior ]
};
