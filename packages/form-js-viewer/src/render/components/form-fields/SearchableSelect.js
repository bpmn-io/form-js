import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import { FormContext } from '../../context';

import XMarkIcon from './icons/XMark.svg';
import AngelDownIcon from './icons/AngelDown.svg';
import AngelUpIcon from './icons/AngelUp.svg';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId,
} from '../Util';

import {
  sanitizeSingleSelectValue
} from '../util/sanitizerUtil';

import classNames from 'classnames';

import DropdownList from './parts/DropdownList';

// TODO: Implement adorners
// import InputAdorner from './parts/InputAdorner';

const type = 'searchableselect';


export default function Searchableselect(props) {
  const {
    disabled,
    errors = [],
    field,
    value
  } = props;

  const {
    description,
    searchable = true,
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

  const valueLabel = useMemo(() => value && valueToOptionMap[value].label || '', [ value, valueToOptionMap ]);

  // whenever we change the underlying value, set the label to it
  useEffect(() => { setFilter(valueLabel); }, [ valueLabel ]);

  const filteredOptions = useMemo(() => {

    if (loadState === LOAD_STATES.LOADED) {
      return options.filter((o) => o.label && o.value && (o.label.toLowerCase().includes(filter.toLowerCase())));
    }

    return [];

  }, [ filter, loadState, options ]);

  const onChange = ({ target }) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setFilter(target.value || '');
  };

  const setValue = useCallback((option) => {
    setFilter(option?.label || '');
    props.onChange({ value: option?.value || null, field });
  }, [ field, props ]);

  const onInputKeyDown = useCallback((keyDownEvent) => {

    switch (keyDownEvent.key) {
    case 'ArrowUp':
      keyDownEvent.preventDefault();
      break;
    case 'ArrowDown': {
      setIsDropdownExpanded(true);
      keyDownEvent.preventDefault();
      break;
    }
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

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null;
    ds.displayDropdown = !disabled && isDropdownExpanded && !isEscapeClosed;
    return ds;
  }, [ disabled, isDropdownExpanded, isEscapeClosed, loadState, value ]);

  const onAngelMouseDown = useCallback((e) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(!isDropdownExpanded);

    const searchbar = searchbarRef.current;
    isDropdownExpanded ? searchbar.blur() : searchbar.focus();

    e.preventDefault();

  }, [ isDropdownExpanded ]);

  return <div class={ formFieldClasses(type, { errors, disabled }) }>
    <Label
      label={ label }
      id={ prefixId(`${ id }-search`, formId) } />
    <div class={ classNames('fjs-searchable-select', { 'disabled': disabled }) }>
      <div class={ classNames('fjs-input-group', { 'disabled': disabled }, { 'hasErrors': errors.length }) }>
        <input
          disabled={ disabled }
          class="fjs-input"
          ref={ searchbarRef }
          id={ prefixId(`${id}-search`, formId) }
          onChange={ onChange }
          type="text"
          value={ filter }
          placeholder={ 'Search' }
          autoComplete="off"
          onKeyDown={ (e) => onInputKeyDown(e) }
          onMouseDown={ () => { setIsEscapeClose(false); setIsDropdownExpanded(true); } }
          onFocus={ () => setIsDropdownExpanded(true) }
          onBlur={ () => { setIsDropdownExpanded(false); setFilter(valueLabel); } } />
        { displayState.displayCross && <span class="fjs-select-cross" onClick={ () => setValue(null) }><XMarkIcon /> </span> }
        <span class="fjs-select-arrow" onMouseDown={ (e) => onAngelMouseDown(e) }>{ displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon /> }</span>
      </div>
    </div>
    <div class="fjs-select-anchor">
      { displayState.displayDropdown && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => { setValue(o); setIsDropdownExpanded(false); } }
        listenerElement={ searchbarRef.current } />}
    </div>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Searchableselect.create = function(options = {}) {

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

Searchableselect.type = type;
Searchableselect.label = 'Search select';
Searchableselect.keyed = true;
Searchableselect.emptyValue = null;
Searchableselect.sanitizeValue = sanitizeSingleSelectValue;