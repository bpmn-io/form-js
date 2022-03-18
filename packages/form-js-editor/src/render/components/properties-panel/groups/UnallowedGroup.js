import { Group } from '../components';
import { labelsByType } from '../Util';

export default function UnallowedGroup(field, editField) {
  const { type } = field;
  const label = labelsByType[ type ];


  return (
    <Group label="Warning">
      <div class="fjs-properties-panel-entry fjs-properties-panel-unallowed">
        <label for="" class="fjs-properties-panel-label">The {label} field is unallowed in the editor.</label>

        <div class="fjs-properties-panel-description">This component type has not been allowedin editor if you remove it you will not be able to add it back</div>
        <div class="fjs-properties-panel-description">You can edit the properties of existing components but can not add additional</div>

      </div>
    </Group>
  );
}