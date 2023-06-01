import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'preact/hooks';

import {
  Slot
} from '../../render-injection/slot-fill';

import {
  CloseIcon,
  iconsByType,
  SearchIcon
} from '../../../render/components/icons';

import { formFields } from '@bpmn-io/form-js-viewer';

export const PALETTE_ENTRIES = formFields.filter(({ config: fieldConfig }) => fieldConfig.type !== 'default').map(({ config: fieldConfig }) => {
  return {
    label: fieldConfig.label,
    type: fieldConfig.type,
    group: fieldConfig.group
  };
});

export const PALETTE_GROUPS = [
  {
    label: 'Basic input',
    id: 'basic-input'
  },
  {
    label: 'Selection',
    id: 'selection'
  },
  {
    label: 'Presentation',
    id: 'presentation'
  },
  {
    label: 'Action',
    id: 'action'
  }
];

export default function Palette(props) {

  const [ entries, setEntries ] = useState(PALETTE_ENTRIES);

  const [ searchTerm, setSearchTerm ] = useState('');

  const inputRef = useRef();

  const groups = groupEntries(entries);

  const simplifyString = useCallback((str) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '');
  }, []);

  const filter = useCallback((entry) => {

    const simplifiedSearchTerm = simplifyString(searchTerm);

    if (!simplifiedSearchTerm) {
      return true;
    }

    const simplifiedEntryLabel = simplifyString(entry.label);
    const simplifiedEntryType = simplifyString(entry.type);

    return simplifiedEntryLabel.includes(simplifiedSearchTerm)
        || simplifiedEntryType.includes(simplifiedSearchTerm);

  }, [ searchTerm, simplifyString ]);

  // filter entries on search change
  useEffect(() => {
    const entries = PALETTE_ENTRIES.filter(filter);
    setEntries(entries);
  }, [ filter, searchTerm ]);

  const handleInput = useCallback(event => {
    setSearchTerm(() => event.target.value);
  }, [ setSearchTerm ]);

  const handleClear = useCallback(event => {
    setSearchTerm('');
    inputRef.current.focus();
  }, [ inputRef, setSearchTerm ]);

  return <div class="fjs-palette">
    <div class="fjs-palette-header" title="Components">
      Components
    </div>
    <div class="fjs-palette-search-container">
      <span class="fjs-palette-search-icon">
        <SearchIcon></SearchIcon>
      </span>
      <input class="fjs-palette-search"
        ref={ inputRef }
        type="text"
        placeholder="Search components"
        value={ searchTerm }
        onInput={ handleInput } />
      {
        searchTerm && (
          <button title="Clear content" class="fjs-palette-search-clear" onClick={ handleClear }>
            <CloseIcon></CloseIcon>
          </button>
        )
      }
    </div>
    <div class="fjs-palette-entries">
      {
        groups.map(({ label, entries, id }) =>
          <div class="fjs-palette-group" data-group-id={ id }>
            <span class="fjs-palette-group-title">{ label }</span>
            <div class="fjs-palette-fields fjs-drag-container fjs-no-drop">
              {
                entries.map(({ label, type }) => {
                  const Icon = iconsByType(type);

                  return (
                    <div
                      class="fjs-palette-field fjs-drag-copy fjs-no-drop"
                      data-field-type={ type }
                      title={ `Create ${getIndefiniteArticle(type)} ${label} element` }
                    >
                      {
                        Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
                      }
                      <span class="fjs-palette-field-text">{ label }</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )
      }
      {
        groups.length == 0 && (
          <div class="fjs-palette-no-entries">No components found.</div>
        )
      }
    </div>
    <div class="fjs-palette-footer">
      {/* @ts-ignore */}
      <Slot name="editor-palette__footer" fillRoot={ FillRoot } />
    </div>
  </div>;
}

const FillRoot = (fill) => <div className="fjs-palette-footer-fill">{fill.children}</div>;

// helpers ///////

function groupEntries(entries) {
  const groups = PALETTE_GROUPS.map(group => {
    return {
      ...group,
      entries: []
    };
  });

  const getGroup = id => groups.find(group => id === group.id);

  entries.forEach(entry => {
    const { group } = entry;
    getGroup(group).entries.push(entry);
  });

  return groups.filter(g => g.entries.length);
}

function getIndefiniteArticle(type) {
  if ([
    'image'
  ].includes(type)) {
    return 'an';
  }

  return 'a';
}