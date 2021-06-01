import { useState } from 'preact/hooks';

import {
  CreateIcon,
  SectionArrowIcon
} from '../icons';

export default function Group(props) {
  const {
    children,
    hasEntries = true,
    label
  } = props;

  const [ open, setOpen ] = useState(hasEntries);

  const toggleOpen = () => setOpen(!open);

  const addEntry = (event) => {
    event.stopPropagation();

    setOpen(true);

    props.addEntry();
  };

  return <div class="fjs-properties-panel-group">
    <div class="fjs-properties-panel-group-header" onClick={ hasEntries ? toggleOpen : () => {} }>
      <span class="fjs-properties-panel-group-header-label">
        { label }
      </span>
      <div class="fjs-properties-panel-group-header-buttons">
        {
          props.addEntry
            ? (
              <button
                class="fjs-properties-panel-group-header-button fjs-properties-panel-group-header-button-add-entry"
                onClick={ addEntry }>
                <CreateIcon />
              </button>
            )
            : null
        }
        <button class="fjs-properties-panel-group-header-button fjs-properties-panel-group-header-button-toggle-open">
          <SectionArrowIcon class={ hasEntries && open ? 'fjs-arrow-down' : 'fjs-arrow-right' } />
        </button>
      </div>
    </div>
    {
      hasEntries && open
        ? (
          <div class="fjs-properties-panel-group-entries">
            {
              children
            }
          </div>
        )
        : null
    }
  </div>;
}