export default function NoopField(props) {

  return (
    <div class="form-field form-field-placeholder">
      Cannot render field &lt;<code>{ props.id }</code>&gt;
    </div>
  );
}