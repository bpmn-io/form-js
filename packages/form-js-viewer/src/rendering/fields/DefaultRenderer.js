import { For, splitProps } from 'solid-js';

import FormElement from '../FormElement';

import { computePath } from '../../util';

export default function DefaultRenderer(props) {
  const [ _, otherProps ] = splitProps(props, [ 'field', 'dataPath', 'schemaPath' ]);

  const childrenSchemaPath = computePath(() => [ ...props.schemaPath, 'components' ]);

  return (
    <FormElement.Children class="fjs-vertical-layout" dataPath={ props.dataPath } schemaPath={ childrenSchemaPath() }>
      <For each={ props.field.components }>
        {
          (component, index) => {
            const dataPath = computePath(() => {
              if (component.key) {
                return [ ...props.dataPath.slice(0, -1), component.key ];
              } else {
                return props.dataPath.slice(0, -1);
              }
            });

            const childSchemaPath = computePath(() => [ ...childrenSchemaPath(), index() ]);

            return <FormElement field={ component } dataPath={ dataPath() } schemaPath={ childSchemaPath() } { ...otherProps } />;
          }
        }
      </For>
      <FormElement.Empty dataPath={ props.dataPath } schemaPath={ props.schemaPath } />
    </FormElement.Children>
  );
}

DefaultRenderer.create = function(options = {}) {
  return {
    type: 'default',
    ...options
  };
};