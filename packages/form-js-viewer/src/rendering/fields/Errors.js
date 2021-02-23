import { For, Show } from 'solid-js';

export default function Errors(props) {
  return <Show when={ props.errors && props.errors.length }>
    <div class="form-field-error">
      <ul>
        <For each={ props.errors }>
          { error => <li>{ error }</li> }
        </For>
      </ul>
    </div>
  </Show>;
}