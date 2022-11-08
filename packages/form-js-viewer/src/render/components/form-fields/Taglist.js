import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import { FormContext } from '../../context';
import classNames from 'classnames';

import CloseIcon from './icons/Close.svg';

import DropdownList from './parts/DropdownList';
import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeMultiSelectValue } from '../util/sanitizerUtil';
import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'taglist';

export default function Taglist(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value : values = []
  } = props;

  const {
    description,
    id,
  } = field;

  const { formId } = useContext(FormContext);
  const [ filter, setFilter ] = useState('');
  const [ filteredOptions, setFilteredOptions ] = useState([]);
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ hasOptionsLeft, setHasOptionsLeft ] = useState(true);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const searchbarRef = useRef();

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  // We cache a map of option values to their index so that we don't need to search the whole options array every time to correlate the label
  const valueToOptionMap = useMemo(() => Object.assign({}, ...options.map((o, x) => ({ [o.value]:  options[x] }))), [ options ]);

  // Usage of stringify is necessary here because we want this effect to only trigger when there is a value change to the array
  useEffect(() => {
    if (loadState === LOAD_STATES.LOADED) {
      setFilteredOptions(options.filter((o) => o.label && o.value && (o.label.toLowerCase().includes(filter.toLowerCase())) && !values.includes(o.value)));
    }
    else {
      setFilteredOptions([]);
    }
  }, [ filter, JSON.stringify(values), options, loadState ]);

  useEffect(() => {
    setHasOptionsLeft(options.length > values.length);
  }, [ options.length, values.length ]);

  const onFilterChange = ({ target }) => {
    setIsEscapeClose(false);
    setFilter(target.value);
  };

  const selectValue = (value) => {
    if (filter) {
      setFilter('');
    }

    // Ensure values cannot be double selected due to latency
    if (values.at(-1) === value) {
      return;
    }

    props.onChange({ value: [ ...values, value ], field });
  };

  const deselectValue = (value) => {
    props.onChange({ value: values.filter((v) => v != value), field });
  };

  const onInputKeyDown = (e) => {

    switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':

      // We do not want the cursor to seek in the search field when we press up and down
      e.preventDefault();
      break;
    case 'Backspace':
      if (!filter && values.length) {
        deselectValue(values[values.length - 1]);
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
      id={ prefixId(`${id}-search`, formId) } />
    <div class={ classNames('fjs-taglist', { disabled, readonly }) }>
      {!disabled && loadState === LOAD_STATES.LOADED &&
        values.map((v) => {
          return (
            <div class="fjs-taglist-tag" onMouseDown={ (e) => e.preventDefault() }>
              <span class="fjs-taglist-tag-label">
                {valueToOptionMap[v] ? valueToOptionMap[v].label : `unexpected value{${v}}`}
              </span>
              <span class="fjs-taglist-tag-remove" onMouseDown={ () => deselectValue(v) }><CloseIcon /></span>
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

        // todo(pinussilvestrus): a11y concerns?
        tabIndex={ readonly ? -1 : 0 }
        onKeyDown={ (e) => onInputKeyDown(e) }
        onMouseDown={ () => setIsEscapeClose(false) }
        onFocus={ () => setIsDropdownExpanded(true) }
        onBlur={ () => { setIsDropdownExpanded(false); setFilter(''); } } />
    </div>
    <div class="fjs-taglist-anchor">
      {!disabled && !readonly && loadState === LOAD_STATES.LOADED && isDropdownExpanded && !isEscapeClosed && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => selectValue(o.value) }
        emptyListMessage={ hasOptionsLeft ? 'No results' : 'All values selected' }
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