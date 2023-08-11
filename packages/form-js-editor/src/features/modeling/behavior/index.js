import IdBehavior from './IdBehavior';
import KeyBehavior from './KeyBehavior';
import PathBehavior from './PathBehavior';
import ValidateBehavior from './ValidateBehavior';

export default {
  __init__: [
    'idBehavior',
    'keyBehavior',
    'pathBehavior',
    'validateBehavior'
  ],
  idBehavior: [ 'type', IdBehavior ],
  keyBehavior: [ 'type', KeyBehavior ],
  pathBehavior: [ 'type', PathBehavior ],
  validateBehavior: [ 'type', ValidateBehavior ]
};
