import { Fragment } from 'preact';

import { iconsByType } from './icons';

const types = [
  {
    label: 'Text Field',
    type: 'textfield'
  },
  {
    label: 'Checkbox',
    type: 'checkbox'
  },
  {
    label: 'Button',
    type: 'button'
  }
];


export default function Palette(props) {
  return <Fragment>
    <div class="fjs-palette-header">FORM ELEMENTS LIBRARY</div>
    <div class="fjs-palette fjs-drag-container fjs-no-drop">
      {
        types.map(({ label, type }) => {
          const Icon = iconsByType[ type ];

          return (
            <div class="fjs-palette-field fjs-drag-copy fjs-no-drop" data-field-type={ type }>
              {
                Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
              }
              <span>{ label }</span>
            </div>
          );
        })
      }
    </div>
  </Fragment>;
}