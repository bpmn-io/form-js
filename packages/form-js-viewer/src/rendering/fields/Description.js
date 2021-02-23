import { Show } from 'solid-js';

export default function Description(props) {

  return (
    <Show when={ props.field.description }>
      <div class="form-field-description">
        { props.field.description }
      </div>
    </Show>
  );
}