import { useContext, useMemo } from 'preact/hooks';

import useService from '../../../hooks/useService';

import FormField from '../../FormField';

import { FormRenderContext } from '../../../context';

export default function ChildrenRenderer(props) {

  const {
    Children
  } = useContext(FormRenderContext);

  const { field, Empty } = props;

  const { id, components = [] } = field;

  const repeatRenderManager = useService('repeatRenderManager', false);

  const isRepeating = repeatRenderManager && repeatRenderManager.isFieldRepeating(id);
  const isEmpty = !components.length;

  const Repeater = repeatRenderManager.Repeater;
  const RepeatInfo = repeatRenderManager.RepeatInfo;

  return <>
    <Children class="fjs-vertical-layout fjs-children cds--grid cds--grid--condensed" field={ field }>
      { isRepeating && Repeater ? <Repeater { ...{ ...props, ElementRenderer: RowsRenderer } } /> : <RowsRenderer { ...props } /> }
      { isEmpty ? <Empty /> : null }
    </Children>
    { isRepeating && RepeatInfo ? <RepeatInfo { ...props } /> : null }
  </>;
}

function RowsRenderer(props) {

  const { field, indexes } = props;
  const { id: parentId } = field;

  const formLayouter = useService('formLayouter');
  const formFieldRegistry = useService('formFieldRegistry');
  const rows = formLayouter.getRows(parentId);

  const {
    Row
  } = useContext(FormRenderContext);

  return <> {
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
            components.map(childId => {

              const childField = formFieldRegistry.get(childId);

              if (!childField) {
                return null;
              }

              return (
                <FormField
                  { ...props }
                  key={ childId }
                  field={ childField }
                  indexes={ indexes } />
              );
            })
          }
        </Row>
      );
    })
  } </>;
}
