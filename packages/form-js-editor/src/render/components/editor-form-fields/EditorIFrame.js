import {
  IFrame
} from '@bpmn-io/form-js-viewer';


export default function EditorIFrame(props) {
  const { field } = props;

  // remove url to display placeholder
  return <IFrame { ...{ ...props, field: { ...field, url: null } } } />;

}

EditorIFrame.config = IFrame.config;
