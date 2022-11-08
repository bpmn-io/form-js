import { useContext } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import classNames from 'classnames';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeMultiSelectValue } from '../util/sanitizerUtil';
import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'checklist';


export default function Checklist(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value = []
  } = props;

  const {
    description,
    id
  } = field;

  const toggleCheckbox = (v) => {

    let newValue = [ ...value ];

    if (!newValue.includes(v)) {
      newValue.push(v);
    } else {
      newValue = newValue.filter(x => x != v);
    }

    props.onChange({
      field,
      value: newValue,
    });
  };

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  const { formId } = useContext(FormContext);

  return <div class={ classNames(formFieldClasses(type, errors), { readonly }) }>
    <Label
      label={ label } />
    {
      loadState == LOAD_STATES.LOADED && options.map((v, index) => {
        return (
          <Label
            id={ prefixId(`${id}-${index}`, formId) }
            key={ `${id}-${index}` }
            label={ v.label }
            required={ false }>
            <input
              checked={ value.includes(v.value) }
              class="fjs-input"
              disabled={ disabled }

              // todo(pinussilvestrus): a11y concerns?
              tabIndex={ readonly ? -1 : 0 }
              id={ prefixId(`${id}-${index}`, formId) }
              type="checkbox"
              onClick={ () => toggleCheckbox(v.value) } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Checklist.create = function(options = {}) {

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

Checklist.type = type;
Checklist.label = 'Checklist';
Checklist.keyed = true;
Checklist.emptyValue = [];
Checklist.sanitizeValue = sanitizeMultiSelectValue;