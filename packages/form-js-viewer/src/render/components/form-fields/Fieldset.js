import { useContext } from 'preact/hooks';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';

export default function Fieldset(props) {
  const { Children } = useContext(FormRenderContext);

  const { field } = props;

  const { label } = field;

  const { components = [] } = field;

  return (
    <fieldset class="fjs-form-fieldset">
      <legend>{ label }</legend>
      <Children class="fjs-vertical-layout" field={ field }>
        {
          components.map((childField) => {
            return (
              <FormField { ...props } key={ childField.id } field={ childField } />
            );
          })
        }
      </Children>
    </fieldset>
  );
}

Fieldset.create = function(options = {}) {
  return {
    components: [],
    ...options,
  };
};

Fieldset.type = 'fieldset';
Fieldset.keyed = false;
Fieldset.label = 'Fieldset';
