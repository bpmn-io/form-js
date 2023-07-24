import { Spacer } from '@bpmn-io/form-js-viewer';
import { editorFormFieldClasses } from '../Util';
import { iconsByType } from '../icons';

const type = 'spacer';

export default function EditorSpacer(props) {
  const { field } = props;
  const { height = 50 } = field;
  const SpacerIcon = iconsByType(type);

  return (
    <div class={ editorFormFieldClasses(type) } style={ { height } }>
      <SpacerIcon viewBox="0 0 54 54" />
    </div>
  );
}

EditorSpacer.config = Spacer.config;
