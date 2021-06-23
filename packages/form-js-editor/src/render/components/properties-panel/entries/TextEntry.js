import { TextareaEntry } from '../components';

export default function TextEntry(props) {
  const {
    editField,
    field
  } = props;

  return (
    <TextareaEntry
      editField={ editField }
      field={ field }
      id="text"
      label="Text"
      path={ [ 'text' ] }
      description="Use Markdown or basic HTML to format." />
  );
}