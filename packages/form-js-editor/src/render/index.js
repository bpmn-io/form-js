import { EditorFormFields } from './EditorFormFields';
import { Renderer } from './Renderer';

export const RenderModule = {
  __init__: [ 'formFields', 'renderer' ],
  formFields: [ 'type', EditorFormFields ],
  renderer: [ 'type', Renderer ]
};