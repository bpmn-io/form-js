import { JSFunctionField, iconsByType } from '@bpmn-io/form-js-viewer';
import { editorFormFieldClasses } from '../Util';

const type = 'script';

export function EditorJSFunctionField(props) {
  const { field } = props;
  const { jsFunction = '' } = field;

  const Icon = iconsByType(type);

  let placeholderContent = 'JS function is empty';

  if (jsFunction.trim()) {
    placeholderContent = 'JS function';
  }

  return (
    <div class={ editorFormFieldClasses(type) }>
      <div class="fjs-form-field-placeholder">
        <Icon viewBox="0 0 54 54" />{placeholderContent}
      </div>
    </div>
  );
}

EditorJSFunctionField.config = {
  ...JSFunctionField.config,
  escapeGridRender: false
};
