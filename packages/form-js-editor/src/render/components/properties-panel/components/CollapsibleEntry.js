import { useState } from 'preact/hooks';

import { stopPropagation } from '../Util';

import {
  ListArrowIcon,
  ListDeleteIcon,
} from '../icons';

export default function CollapsibleEntry(props) {
  const {
    children,
    label,
    removeEntry = () => {}
  } = props;

  const [ collapsed, setCollapsed ] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const classes = [ 'fjs-properties-panel-collapsible-entry' ];

  if (collapsed) {
    classes.push('fjs-properties-panel-collapsible-entry-collapsed');
  }

  return (
    <div class={ classes.join(' ') }>
      <div class="fjs-properties-panel-collapsible-entry-header" onClick={ toggleCollapsed }>
        <div>
          <ListArrowIcon class={ collapsed ? 'fjs-arrow-right' : 'fjs-arrow-down' } />
          <span class="fjs-properties-panel-collapsible-entry-header-label">
            { label }
          </span>
        </div>
        <button
          class="fjs-properties-panel-collapsible-entry-header-remove-entry"
          onClick={ stopPropagation(removeEntry) }>
          <ListDeleteIcon />
        </button>
      </div>
      {
        collapsed
          ? null
          : (
            <div class="fjs-properties-panel-collapsible-entry-entries">
              {
                children
              }
            </div>
          )
      }
    </div>
  );
}