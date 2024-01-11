import {
  iconsByType,
  IFrame
} from '@bpmn-io/form-js-viewer';

import { editorFormFieldClasses } from '../Util';

export function EditorIFrame(props) {
  const { field } = props;

  const Icon = iconsByType(field.type);

  return <div class={ editorFormFieldClasses(field.type) }>
    <div class="fjs-iframe-placeholder">
      <p class="fjs-iframe-placeholder-text"><Icon width="32" height="24" viewBox="0 0 56 56" />iFrame</p>
    </div>
  </div>;
}

EditorIFrame.config = IFrame.config;
