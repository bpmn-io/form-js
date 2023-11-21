import {
  iconsByType,
  IFrame
} from '@bpmn-io/form-js-viewer';


export default function EditorIFrame(props) {
  const { field } = props;

  const Icon = iconsByType(field.type);

  return (
    <div class="fjs-iframe-placeholder">
      <p class="fjs-iframe-placeholder-text"><Icon width="32" height="24" viewBox="0 0 56 56" />iFrame</p>
    </div>
  );

}

EditorIFrame.config = IFrame.config;
