import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useService } from '../hooks';

export default (props) => {
  const {
    rootClass,
    RootElement,
    section,
    children
  } = props;

  const eventBus = useService('eventBus');
  const sectionConfig = useService(`config.${section}`);

  const [ parent, setParent ] = useState(sectionConfig && sectionConfig.parent || null);
  const [ shouldRender, setShouldRender ] = useState(true);

  const ParentElement = useMemo(() => {

    if (parent === null) {
      return null;
    }

    if (typeof parent === 'string') {

      const element = document.querySelector(parent);

      if (!element) {
        throw new Error(`Target root element with selector '${ parent }' not found for section '${ section }'`);
      }

      return document.querySelector(parent);
    }

    // @ts-ignore
    if (!(parent instanceof Element)) {
      throw new Error(`Target root element for section '${ section }' must be a valid selector or DOM element`);
    }

    return parent;

  }, [ section, parent ]);

  useEffect(() => {
    const onAttach = ({ container }) => {
      setParent(container);
      setShouldRender(true);
    };

    const onDetach = () => {
      setParent(null);
      setShouldRender(false);
    };

    const onReset = () => {
      setParent(null);
      setShouldRender(true);
    };

    eventBus.on(`${ section }.attach`, onAttach);
    eventBus.on(`${ section }.detach`, onDetach);
    eventBus.on(`${ section }.reset`, onReset);
    eventBus.fire(`${ section }.section.rendered`);

    return () => {
      eventBus.off(`${ section }.attach`, onAttach);
      eventBus.off(`${ section }.detach`, onDetach);
      eventBus.off(`${ section }.reset`, onReset);
      eventBus.fire(`${ section }.section.destroyed`);
    };
  }, [ eventBus, section ]);


  useEffect(() => {
    if (shouldRender) {
      eventBus.fire(`${ section }.rendered`, { element: ParentElement });
      return () => { eventBus.fire(`${ section }.destroyed`, { element: ParentElement }); };
    }
  }, [ eventBus, section, shouldRender, ParentElement ]);

  const Root = useCallback(
    ({ children }) => RootElement ? <RootElement>{ children }</RootElement> : <div className={ rootClass }>{ children }</div>, [ rootClass, RootElement ]
  );

  return (
    shouldRender
      ? (parent
        ? createPortal(<Root>{ children }</Root>, ParentElement)
        : <Root>{ children }</Root>)
      : null
  );
};