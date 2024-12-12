import { iconsByType, DocumentPreview, Label } from '@bpmn-io/form-js-viewer';

import { editorFormFieldClasses } from '../Util';

export function EditorDocumentPreview(props) {
  const { field, domId } = props;

  const { label } = field;

  const Icon = iconsByType(field.type);

  return (
    <div class={editorFormFieldClasses(field.type)}>
      <Label id={domId} label={label} />
      <div class="fjs-documentPreview-placeholder" id={domId}>
        <p class="fjs-documentPreview-placeholder-text">
          <Icon width="32" height="24" viewBox="0 0 56 56" />
          Document preview
        </p>
      </div>
    </div>
  );
}

EditorDocumentPreview.config = DocumentPreview.config;
