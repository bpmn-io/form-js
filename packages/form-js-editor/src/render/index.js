import EditorFormFields from './EditorFormFields';
import Renderer from './Renderer';

export default {
  __init__: [ 'formFields', 'renderer' ],
  formFields: [ 'type', EditorFormFields ],
  renderer: [ 'type', Renderer ]
};