import { iconsByType } from './icons';

const types = [
  {
    label: 'Text Field',
    type: 'textfield'
  },
  {
    label: 'Number',
    type: 'number'
  },
  {
    label: 'Checkbox',
    type: 'checkbox'
  },
  {
    label: 'Radio',
    type: 'radio'
  },
  {
    label: 'Select',
    type: 'select'
  },
  {
    label: 'File',
    type: 'file'
  },
  {
    label: 'Text',
    type: 'text'
  },

  {
    label: 'Button',
    type: 'button'
  }
];


export default function Palette(props) {
  return <div class="fjs-palette">
    <div class="fjs-palette-header" title="Form elements library">
      <span class="fjs-hide-compact">FORM ELEMENTS </span>LIBRARY
    </div>
    <div class="fjs-palette-fields fjs-drag-container fjs-no-drop">
      {
        types.map(({ label, type }) => {
          const Icon = iconsByType[ type ];

          return (
            <div
              class="fjs-palette-field fjs-drag-copy fjs-no-drop"
              data-field-type={ type }
              title={ `Create a ${ label } element` }
            >
              {
                Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
              }
              <span class="fjs-palette-field-text fjs-hide-compact">{ label }</span>
            </div>
          );
        })
      }
    </div>
  </div>;
}