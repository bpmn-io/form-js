import { useCallback, useContext, useMemo, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import { FormContext } from '../../context';

import CloseIcon from './icons/Close.svg';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId,
  sanitizeSingleSelectValue
} from '../Util';

import classNames from 'classnames';

import DropdownList from './parts/DropdownList';
import InputAdorner from './parts/InputAdorner';

const type = 'searchableselect';


export default function searchableselect(props) {
  const {
    disabled,
    errors = [],
    field,
    value
  } = props;

  const {
    description,
    id,
    label
  } = field;

  const { formId } = useContext(FormContext);
  const [ filter, setFilter ] = useState('');
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const searchbarRef = useRef();

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  // We cache a map of option values to their index so that we don't need to search the whole options array every time to correlate the label
  const valueToOptionMap = useMemo(() => Object.assign({}, ...options.map((o, x) => ({ [o.value]: options[x] }))), [ options ]);

  const filteredOptions = useMemo(() => {

    if (loadState === LOAD_STATES.LOADED) {
      return options.filter((o) => o.label && o.value && (o.label.toLowerCase().includes(filter.toLowerCase())));
    }

    return [];

  }, [ filter, loadState, options ]);

  const onFilterChange = ({ target }) => {
    setIsEscapeClose(false);
    setFilter(target.value);
  };

  const setValue = useCallback((value) => {
    setFilter('');
    props.onChange({ value: value, field });
  }, [ field, props ]);

  const onInputKeyDown = useCallback((keyDownEvent) => {

    switch (keyDownEvent.key) {
    case 'ArrowUp':
    case 'ArrowDown':

      // We do not want the cursor to seek in the search field when we press up and down
      keyDownEvent.preventDefault();
      break;
    case 'Escape':
      setIsEscapeClose(true);
      break;
    case 'Enter':
      if (isEscapeClosed) {
        setIsEscapeClose(false);
      }
      break;
    }
  }, [ isEscapeClosed ]);

  const SelectDisplay = useMemo(() => <div class="fjs-input-group">
    <span style={ { padding: '8px', flexGrow: '1' } }>{valueToOptionMap[value] ? valueToOptionMap[value].label : `unexpected value{${value}}`} </span>
    <span class="fjs-input-adornment border-left border-radius-right" onClick={ () => setValue(null) }><CloseIcon /></span>
  </div>, [ setValue, value, valueToOptionMap ]);

  const SelectInput = useMemo(() => <input
    disabled={ disabled }
    class="fjs-input"
    ref={ searchbarRef }
    id={ prefixId(`${id}-search`, formId) }
    onChange={ onFilterChange }
    type="text"
    value={ filter }
    placeholder={ 'Search' }
    autoComplete="off"
    onKeyDown={ (e) => onInputKeyDown(e) }
    onMouseDown={ () => setIsEscapeClose(false) }
    onFocus={ () => setIsDropdownExpanded(true) }
    onBlur={ () => { setIsDropdownExpanded(false); setFilter(''); } } />, [ disabled, filter, formId, id, onInputKeyDown ]);

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && loadState === LOAD_STATES.LOADED;
    ds.displaySelection = ds.componentReady && value !== null;
    ds.displaySearch = ds.componentReady && value === null;
    ds.displayDropdown = ds.displaySearch && isDropdownExpanded && !isEscapeClosed;
    return ds;
  }, [ disabled, isDropdownExpanded, isEscapeClosed, loadState, value ]);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      id={ prefixId(`${ id }-search`, formId) } />
    <div class={ classNames('fjs-searchable-select', { 'disabled': disabled }) }>
      { displayState.displaySelection && SelectDisplay }
      { displayState.displaySearch && SelectInput }
    </div>
    <div class="fjs-taglist-anchor">
      { displayState.displayDropdown && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => { setValue(o.value); setIsDropdownExpanded(false); } }
        listenerElement={ searchbarRef.current } />}
    </div>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

searchableselect.create = function(options = {}) {

  if (options.valuesKey) return options;

  return {
    values: [
      {
        label: 'Value',
        value: 'value'
      }
    ],
    ...options
  };
};

searchableselect.type = type;
searchableselect.label = 'Searchable select';
searchableselect.keyed = true;
searchableselect.emptyValue = null;
searchableselect.sanitizeValue = sanitizeSingleSelectValue;