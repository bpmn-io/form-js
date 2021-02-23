import { Show } from 'solid-js';

export default function Label(props) {

  return (
    <Show when={ props.field.label }>
      <label class="fjs-form-field-label" for={ props.for }>
        { props.children }
        { props.field.label }
        <Show when={ props.field.validate && props.field.validate.required }>
          <span class="fjs-asterix">*</span>
        </Show>
      </label>
    </Show>
  );
}