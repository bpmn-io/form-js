import {
  iconsByType,
  IFrame,
  Label
} from '@bpmn-io/form-js-viewer';

import { editorFormFieldClasses } from '../Util';

export function EditorIFrame(props) {
  const { field, domId } = props;

  const { label } = field;

  const Icon = iconsByType(field.type);

  return <div class={ editorFormFieldClasses(field.type) }>
    <Label id={ domId } label={ label } />
    <div class="fjs-iframe-placeholder" id={ domId }>
      <p class="fjs-iframe-placeholder-text"><Icon width="32" height="24" viewBox="0 0 56 56" />iFrame</p>
    </div>
  </div>;
}

EditorIFrame.config = IFrame.config;
