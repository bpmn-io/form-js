import { FormFields } from '@bpmn-io/form-js-viewer';
import { editorFormFields } from './components/editor-form-fields/';

export default class EditorFormFields extends FormFields {
  constructor() {
    super();
    editorFormFields.forEach((formField) => {
      this.register(formField.config.type, formField);
    });
  }
}