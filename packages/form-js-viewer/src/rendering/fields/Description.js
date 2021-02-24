import { Show } from 'solid-js';

export default function Description(props) {

  return (
    <Show when={ props.field.description }>
      <div class="fjs-form-field-description">
        { props.field.description }
      </div>
    </Show>
  );
}