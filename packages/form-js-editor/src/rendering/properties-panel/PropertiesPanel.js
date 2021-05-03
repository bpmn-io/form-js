import {
  GeneralGroup,
  ValidationGroup
} from './groups';

import {
  INPUTS,
  textToLabel
} from './Util';

import { iconsByType } from '../palette/icons';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  columns: 'COLUMNS',
  number: 'NUMBER',
  radio: 'RADIO',
  text: 'TEXT',
  textfield: 'TEXT FIELD'
};

function getGroups(field, editField) {
  const { type } = field;

  const groups = [
    GeneralGroup(field, editField)
  ];

  if (INPUTS.includes(type) && type !== 'checkbox') {
    groups.push(ValidationGroup(field, editField));
  }

  return groups;
}

export default function PropertiesPanel(props) {
  const {
    editField,
    field
  } = props;

  if (!field || field.type === 'default') {
    return <div class="fjs-properties-panel-placeholder">Select a form field to edit its properties.</div>;
  }

  const { type } = field;

  const Icon = iconsByType[ type ];

  const label = labelsByType[ type ];

  return <div class="fjs-properties-panel">
    <div class="fjs-properties-panel-header">
      <div class="fjs-properties-panel-header-icon">
        <Icon width="36" height="36" viewBox="0 0 54 54" />
      </div>
      <div>
        <span class="fjs-properties-panel-header-type">{ label }</span>
        {
          type === 'text'
            ? <div class="fjs-properties-panel-header-label">{ textToLabel(field.text) }</div>
            : <div class="fjs-properties-panel-header-label">{ field.label }</div>
        }
      </div>
    </div>
    {
      getGroups(field, editField)
    }
  </div>;
}