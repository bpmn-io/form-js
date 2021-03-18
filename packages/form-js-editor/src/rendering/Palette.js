import { Fragment } from 'preact';

import { iconsByType } from './icons';

const types = [
  {
    label: 'Text Field',
    type: 'textfield'
  },
  {
    label: 'Button',
    type: 'button'
  },
  {
    label: 'Checkbox',
    type: 'checkbox'
  },
  {
    label: 'Number',
    type: 'number'
  },
  {
    label: 'Columns',
    type: 'columns'
  },
];


export default function Palette(props) {
  return <Fragment>
    <div class="palette-header">FORM ELEMENTS LIBRARY</div>
    <div class="palette drag-container">
      {
        types.map(({ label, type }) => {
          const Icon = iconsByType[ type ];

          return (
            <div class="palette-field drag-copy no-drop" data-field-type={ type }>
              {
                Icon ? <Icon class="palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
              }
              <span>{ label }</span>
            </div>
          );
        })
      }
    </div>
  </Fragment>;
}