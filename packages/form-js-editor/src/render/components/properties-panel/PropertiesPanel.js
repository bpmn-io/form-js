import { useService } from '../../hooks';
import { iconsByType } from '../palette/icons';
import { CustomValuesGroup, GeneralGroup, ValidationGroup, ValuesGroup } from './groups';
import { INPUTS, textToLabel } from './Util';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  columns: 'COLUMNS',
  default: 'FORM',
  number: 'NUMBER',
  radio: 'RADIO',
  select: 'SELECT',
  text: 'TEXT',
  textfield: 'TEXT FIELD',
  file: 'FILE'
};

function getGroups(field, editField) {
  const { type } = field;

  const groups = [
    GeneralGroup(field, editField)
  ];

  if (type === 'radio' || type === 'select') {
    groups.push(ValuesGroup(field, editField));
  }

  if (INPUTS.includes(type) && type !== 'checkbox') {
    groups.push(ValidationGroup(field, editField));
  }

  if (type !== 'default') {
    groups.push(CustomValuesGroup(field, editField));
  }

  return groups;
}

export default function PropertiesPanel(props) {
  const {
    editField,
    field
  } = props;

  const eventBus = useService('eventBus');

  if (!field) {
    return <div class="fjs-properties-panel-placeholder">Select a form field to edit its properties.</div>;
  }

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const { type } = field;

  const Icon = iconsByType[ type ];

  const label = labelsByType[ type ];

  return (
    <div
      class="fjs-properties-panel"
      data-field={ field.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <div class="fjs-properties-panel-header">
        <div class="fjs-properties-panel-header-icon">
          <Icon width="36" height="36" viewBox="0 0 54 54" />
        </div>
        <div>
          <span class="fjs-properties-panel-header-type">{ label }</span>
          {
            type === 'text'
              ? <div class="fjs-properties-panel-header-label">{ textToLabel(field.text) }</div>
              : type === 'default'
                ? <div class="fjs-properties-panel-header-label">{ field.id }</div>
                : <div class="fjs-properties-panel-header-label">{ field.label }</div>
          }
        </div>
      </div>
      {
        getGroups(field, editField)
      }
    </div>
  );
}