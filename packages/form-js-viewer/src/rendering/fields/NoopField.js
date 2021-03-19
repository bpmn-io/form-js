export default function NoopField(props) {

  if (true) {
    throw new Error(`cannot render field <${props.field.type}>`);
  }

  return null;
}