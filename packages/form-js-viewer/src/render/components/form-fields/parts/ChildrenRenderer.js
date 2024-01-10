import { useContext, useState } from 'preact/hooks';

import { useService } from '../../../hooks/useService';

import { FormField } from '../../FormField';

import { FormRenderContext } from '../../../context';

export function ChildrenRenderer(props) {

  const {
    Children
  } = useContext(FormRenderContext);

  const { field, Empty } = props;

  const { id } = field;

  const repeatRenderManager = useService('repeatRenderManager', false);

  const isRepeating = repeatRenderManager && repeatRenderManager.isFieldRepeating(id);

  const Repeater = repeatRenderManager.Repeater;
  const RepeatFooter = repeatRenderManager.RepeatFooter;

  return (
    isRepeating
      ? <RepeatChildrenRenderer { ...props } { ...{ ChildrenRoot: Children, Empty, Repeater, RepeatFooter, repeatRenderManager } } />
      : <SimpleChildrenRenderer { ...props } { ...{ ChildrenRoot: Children, Empty } } />
  );
}

function SimpleChildrenRenderer(props) {

  const {
    ChildrenRoot,
    Empty,
    field
  } = props;

  const { components = [] } = field;

  const isEmpty = !components.length;

  return (
    <ChildrenRoot class="fjs-vertical-layout fjs-children cds--grid cds--grid--condensed" field={ field }>
      <RowsRenderer { ...props } />
      { isEmpty ? <Empty field={ field } /> : null }
    </ChildrenRoot>
  );
}

function RepeatChildrenRenderer(props) {

  const {
    ChildrenRoot,
    repeatRenderManager,
    Empty,
    field,
    ...restProps
  } = props;

  const { components = [] } = field;

  const useSharedState = useState({ isCollapsed: true });

  const Repeater = repeatRenderManager.Repeater;
  const RepeatFooter = repeatRenderManager.RepeatFooter;

  return <>
    <ChildrenRoot class="fjs-vertical-layout fjs-children cds--grid cds--grid--condensed" field={ field }>
      { Repeater ? <Repeater { ...{ ...restProps, useSharedState, field, RowsRenderer } } /> : <RowsRenderer { ...{ ...restProps, field } } /> }
      { !components.length ? <Empty field={ field } /> : null }
    </ChildrenRoot>
    { RepeatFooter ? <RepeatFooter { ...{ ...restProps, useSharedState, field } } /> : null }
  </>;
}

function RowsRenderer(props) {

  const { field, indexes } = props;
  const { id: parentId, verticalAlignment = 'start' } = field;

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
        <Row row={ row } class="fjs-layout-row cds--row" style={ { alignItems: verticalAlignment } }>
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
