import { Group } from '../components';
import { labelsByType } from '../Util';

export default function ReadOnlyGroup(field, editField) {
  const { type } = field;
  const label = labelsByType[ type ];


  return (
    <Group label="Read Only">
      <div class="fjs-properties-panel-entry fjs-properties-panel-readonly">
        <label for="" class="fjs-properties-panel-label">The {label} field is read only.</label>

        <div class="fjs-properties-panel-description">This component type has not been allowedin editor and has been set as read only.</div>
        <div class="fjs-properties-panel-description">you can move the position of this component but can not edit its properties</div>

      </div>
    </Group>
  );
}