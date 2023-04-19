import { useContext } from 'preact/hooks';

import useService from '../../hooks/useService';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';

export default function Default(props) {
  const {
    Children,
    Empty,
    Row
  } = useContext(FormRenderContext);

  const { field } = props;

  const { id, components = [] } = field;

  const formLayouter = useService('formLayouter');
  const formFieldRegistry = useService('formFieldRegistry');
  const rows = formLayouter.getRows(id);

  return <Children class="fjs-vertical-layout fjs-children cds--grid cds--grid--condensed" field={ field }>
    {

      rows.map(row => {
        const {
          components = []
        } = row;

        if (!components.length) {
          return null;
        }

        return (
          <Row row={ row } class="fjs-layout-row cds--row">
            {
              components.map(id => {

                const childField = formFieldRegistry.get(id);

                if (!childField) {
                  return null;
                }

                return (
                  <FormField
                    { ...props }
                    key={ childField.id }
                    field={ childField } />
                );
              })
            }
          </Row>
        );
      })
    }
    {
      components.length ? null : <Empty />
    }
  </Children>;
}

Default.config = {
  type: 'default',
  keyed: false,
  label: null,
  group: null,
  create: (options = {}) => ({
    components: [],
    ...options
  })
};
