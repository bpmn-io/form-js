import { Default } from '@bpmn-io/form-js-viewer';

import { NumberInputEntry } from '../components';

export default function ColumnsEntry(props) {
  const {
    editField,
    field
  } = props;

  const onInput = (value) => {
    let components = field.components.slice();

    if (value > components.length) {
      while (value > components.length) {
        components.push(Default.create({ _parent: field.id }));
      }
    } else {
      components = components.slice(0, value);
    }

    editField(field, 'components', components);
  };

  const value = field.components.length;

  return (
    <div class="fjs-properties-panel-entry">
      <NumberInputEntry
        id="columns"
        label="Columns"
        onInput={ onInput }
        value={ value }
        min="1"
        max="3" />
    </div>
  );
}