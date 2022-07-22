import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import { FormContext } from '../../context';

import CloseIcon from './icons/Close.svg';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId,
  sanitizeMultiSelectValue
} from '../Util';

import classNames from 'classnames';

import DropdownList from './parts/DropdownList';

const type = 'taglist';


export default function Taglist(props) {
  const {
    disabled,
    errors = [],
    field,
    value : values = []
  } = props;

  const {
    description,
    id,
    label
  } = field;

  const { formId } = useContext(FormContext);
  const [ filter, setFilter ] = useState('');
  const [ selectedValues, setSelectedValues ] = useState([]);
  const [ filteredValues, setFilteredValues ] = useState([]);
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ hasValuesLeft, setHasValuesLeft ] = useState(true);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const searchbarRef = useRef();

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);


  // Usage of stringify is necessary here because we want this effect to only trigger when there is a value change to the array
  useEffect(() => {
    if (loadState === LOAD_STATES.LOADED) {
      const selectedValues = values.map(v => options.find(o => o.value === v)).filter(v => v !== undefined);
      setSelectedValues(selectedValues);
    }
    else {
      setSelectedValues([]);
    }
  }, [ JSON.stringify(values), options, loadState ]);

  useEffect(() => {
    if (loadState === LOAD_STATES.LOADED) {
      setFilteredValues(options.filter((o) => o.label && (o.label.toLowerCase().includes(filter.toLowerCase())) && !values.includes(o.value)));
    }
    else {
      setFilteredValues([]);
    }
  }, [ filter, JSON.stringify(values), options ]);

  useEffect(() => {
    setHasValuesLeft(selectedValues.length < options.length);
  }, [ selectedValues.length, options.length ]);

  const onFilterChange = ({ target }) => {
    setIsEscapeClose(false);
    setFilter(target.value);
  };

  const selectValue = (option) => {
    setFilter('');
    props.onChange({ value: [ ...values, option.value ], field });
  };

  const deselectValue = (option) => {
    props.onChange({ value: values.filter((v) => v != option.value), field });
  };

  const onInputKeyDown = (e) => {

    switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':

      // We do not want the cursor to seek in the search field when we press up and down
      e.preventDefault();
      break;
    case 'Backspace':
      if (!filter && selectedValues.length) {
        deselectValue(selectedValues[selectedValues.length - 1]);
      }
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
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      id={ prefixId(id, formId) } />
    <div class={ classNames('fjs-taglist', { 'disabled': disabled }) }>
      {!disabled && loadState === LOAD_STATES.LOADED &&
        selectedValues.map((sv) => {
          return (
            <div class="fjs-taglist-tag" onMouseDown={ (e) => e.preventDefault() }>
              <span class="fjs-taglist-tag-label">
                {sv.label}
              </span>
              <span class="fjs-taglist-tag-remove" onMouseDown={ () => deselectValue(sv) }><CloseIcon /></span>
            </div>
          );
        })
      }
      <input
        disabled={ disabled }
        class="fjs-taglist-input"
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
        onBlur={ () => { setIsDropdownExpanded(false); setFilter(''); } } />
    </div>
    <div class="fjs-taglist-anchor">
      {!disabled && loadState === LOAD_STATES.LOADED && isDropdownExpanded && !isEscapeClosed && <DropdownList
        values={ filteredValues }
        getLabel={ (v) => v.label }
        onValueSelected={ (v) => selectValue(v) }
        emptyListMessage={ hasValuesLeft ? 'No results' : 'All values selected' }
        listenerElement={ searchbarRef.current } />}
    </div>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Taglist.create = function(options = {}) {

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

Taglist.type = type;
Taglist.label = 'Taglist';
Taglist.keyed = true;
Taglist.emptyValue = [];
Taglist.sanitizeValue = sanitizeMultiSelectValue;