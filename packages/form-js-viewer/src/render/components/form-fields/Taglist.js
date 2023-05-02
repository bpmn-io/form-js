import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';

import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import { FormContext } from '../../context';
import classNames from 'classnames';

import XMarkIcon from './icons/XMark.svg';

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
    readonly,
    value : values = []
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;
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

  const onBlur = () => {
    setIsDropdownExpanded(false);
    setFilter('');
  };

  const onTagRemoveClick = (event, value) => {
    const { target } = event;

    deselectValue(value);

    // restore focus if there is no next sibling to focus
    const nextTag = target.closest('.fjs-taglist-tag').nextSibling;
    if (!nextTag) {
      searchbarRef.current.focus();
    }
  };

  const shouldDisplayDropdown = useMemo(() => !disabled && loadState === LOAD_STATES.LOADED && isDropdownExpanded && !isEscapeClosed, [ disabled, isDropdownExpanded, isEscapeClosed, loadState ]);

  return <div
    class={ formFieldClasses(type, { errors, disabled, readonly }) }
    onKeyDown={
      (event) => {
        if (event.key === 'Enter') {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  >
    <Label
      label={ label }
      required={ required }
      id={ prefixId(`${id}-search`, formId) } />
    <div class={ classNames('fjs-taglist', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }) }>
      { loadState === LOAD_STATES.LOADED &&
        <div class="fjs-taglist-tags">
          {
            values.map((v) => {
              return (
                <div class={ classNames('fjs-taglist-tag', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }) } onMouseDown={ (e) => e.preventDefault() }>
                  <span class="fjs-taglist-tag-label">
                    {valueToOptionMap[v] ? valueToOptionMap[v].label : `unexpected value{${v}}`}
                  </span>
                  { (!disabled && !readonly) && <button
                    type="button"
                    title="Remove tag"
                    class="fjs-taglist-tag-remove"
                    onClick={ (event) => onTagRemoveClick(event, v) }>

                    <XMarkIcon />
                  </button> }
                </div>
              );
            })
          }
        </div>
      }
      <input
        disabled={ disabled }
        readOnly={ readonly }
        class="fjs-taglist-input"
        ref={ searchbarRef }
        id={ prefixId(`${id}-search`, formId) }
        onChange={ onFilterChange }
        type="text"
        value={ filter }
        placeholder={ (disabled || readonly) ? undefined : 'Search' }
        autoComplete="off"
        onKeyDown={ onInputKeyDown }
        onMouseDown={ () => setIsEscapeClose(false) }
        onFocus={ () => !readonly && setIsDropdownExpanded(true) }
        onBlur={ () => { !readonly && onBlur(); } }
        aria-describedby={ errorMessageId } />
    </div>
    <div class="fjs-taglist-anchor">
      { shouldDisplayDropdown && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => selectValue(o.value) }
        emptyListMessage={ hasOptionsLeft ? 'No results' : 'All values selected' }
        listenerElement={ searchbarRef.current } /> }
    </div>
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Taglist.config = {
  type,
  keyed: true,
  label: 'Tag list',
  group: 'selection',
  emptyValue: [],
  sanitizeValue: sanitizeMultiSelectValue,
  create: (options = {}) => {

    const defaults = {};

    // provide default values if valuesKey isn't set
    if (!options.valuesKey) {
      defaults.values = [
        {
          label: 'Value',
          value: 'value'
        }
      ];
    }

    return {
      ...defaults,
      ...options
    };
  }
};
