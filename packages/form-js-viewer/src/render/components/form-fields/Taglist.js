import { useMemo, useRef, useState } from 'preact/hooks';

import {
  useDeepCompareMemoize,
  useService,
  useOptionsAsync,
  useCleanupMultiSelectValue,
  useGetLabelCorrelation,
  LOAD_STATES
} from '../../hooks';

import XMarkIcon from './icons/XMark.svg';
import { DropdownList } from './parts/DropdownList';
import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';
import { SkipLink } from './parts/SkipLink';

import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { sanitizeMultiSelectValue, hasEqualValue } from '../util/sanitizerUtil';
import { createEmptyOptions } from '../util/optionsUtil';
import { formFieldClasses } from '../Util';

const type = 'taglist';

export function Taglist(props) {
  const {
    disabled,
    errors = [],
    onFocus,
    domId,
    onBlur,
    field,
    readonly,
    value
  } = props;

  const {
    description,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const [ filter, setFilter ] = useState('');
  const [ isDropdownExpanded, setIsDropdownExpanded ] = useState(false);
  const [ isEscapeClosed, setIsEscapeClose ] = useState(false);
  const focusScopeRef = useRef();
  const inputRef = useRef();
  const eventBus = useService('eventBus');

  const {
    loadState,
    options
  } = useOptionsAsync(field);

  // ensures we render based on array content instead of reference
  const values = useDeepCompareMemoize(value || []);

  useCleanupMultiSelectValue({
    field,
    loadState,
    options,
    values,
    onChange: props.onChange
  });

  const getLabelCorrelation = useGetLabelCorrelation(options);

  const hasOptionsLeft = useMemo(() => options.length > values.length, [ options.length, values.length ]);

  const filteredOptions = useMemo(() => {
    if (loadState !== LOAD_STATES.LOADED) {
      return [];
    }

    const isValidFilteredOption = (option) => {
      const filterMatches = option.label.toLowerCase().includes(filter.toLowerCase());
      return filterMatches && !hasEqualValue(option.value, values);
    };

    return options.filter(isValidFilteredOption);
  }, [ filter, options, values, loadState ]);


  const selectValue = (value) => {

    setFilter('');

    // Ensure values cannot be double selected due to latency
    if (values.at(-1) === value) {
      return;
    }

    props.onChange({ value: [ ...values, value ], field });
  };

  const deselectValue = (value) => {
    const newValues = values.filter((v) => !isEqual(v, value));
    props.onChange({ value: newValues, field });
  };

  const onInputChange = ({ target }) => {
    setIsEscapeClose(false);
    setFilter(target.value || '');
    eventBus.fire('formField.search', { formField: field, value: target.value || '' });
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

  const onElementBlur = (e) => {
    if (focusScopeRef.current.contains(e.relatedTarget)) return;
    onBlur && onBlur();
  };

  const onElementFocus = (e) => {
    if (focusScopeRef.current.contains(e.relatedTarget)) return;
    onFocus && onFocus();
  };

  const onInputBlur = (e) => {
    if (!readonly) {
      setIsDropdownExpanded(false);
      setFilter('');
    }
    onElementBlur(e);
  };

  const onInputFocus = (e) => {
    if (!readonly) {
      setIsDropdownExpanded(true);
    }
    onElementFocus(e);
  };

  const onTagRemoveClick = (event, value) => {
    const { target } = event;

    deselectValue(value);

    // restore focus if there is no next sibling to focus
    const nextTag = target.closest('.fjs-taglist-tag').nextSibling;
    if (!nextTag) {
      inputRef.current.focus();
    }
  };

  const onSkipToSearch = () => {
    inputRef.current.focus();
  };

  const shouldDisplayDropdown = useMemo(() => !disabled && loadState === LOAD_STATES.LOADED && isDropdownExpanded && !isEscapeClosed, [ disabled, isDropdownExpanded, isEscapeClosed, loadState ]);

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  return <div
    ref={ focusScopeRef }
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
      htmlFor={ domId } />
    { (!disabled && !readonly && !!values.length) && <SkipLink className="fjs-taglist-skip-link" label="Skip to search" onSkip={ onSkipToSearch } /> }
    <div class={ classNames('fjs-taglist', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }) }>
      { loadState === LOAD_STATES.LOADED &&
        <div class="fjs-taglist-tags">
          {
            values.map((v) => {
              return (
                <div class={ classNames('fjs-taglist-tag', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }) } onMouseDown={ (e) => e.preventDefault() }>
                  <span class="fjs-taglist-tag-label">
                    { getLabelCorrelation(v) }
                  </span>
                  { (!disabled && !readonly) && <button
                    type="button"
                    title="Remove tag"
                    class="fjs-taglist-tag-remove"
                    onFocus={ onElementFocus }
                    onBlur={ onElementBlur }
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
        ref={ inputRef }
        id={ domId }
        onChange={ onInputChange }
        type="text"
        value={ filter }
        placeholder={ (disabled || readonly) ? undefined : 'Search' }
        autoComplete="off"
        onKeyDown={ onInputKeyDown }
        onMouseDown={ () => setIsEscapeClose(false) }
        onFocus={ onInputFocus }
        onBlur={ onInputBlur }
        aria-describedby={ [ descriptionId, errorMessageId ].join(' ') }
        required={ required }
        aria-invalid={ errors.length > 0 } />
    </div>
    <div class="fjs-taglist-anchor">
      { shouldDisplayDropdown && <DropdownList
        values={ filteredOptions }
        getLabel={ (o) => o.label }
        onValueSelected={ (o) => selectValue(o.value) }
        emptyListMessage={ hasOptionsLeft ? 'No results' : 'All values selected' }
        listenerElement={ inputRef.current } /> }
    </div>
    <Description id={ descriptionId } description={ description } />
    <Errors id={ errorMessageId } errors={ errors } />
  </div>;
}

Taglist.config = {
  type,
  keyed: true,
  label: 'Tag list',
  group: 'selection',
  emptyValue: [],
  sanitizeValue: sanitizeMultiSelectValue,
  create: createEmptyOptions
};
