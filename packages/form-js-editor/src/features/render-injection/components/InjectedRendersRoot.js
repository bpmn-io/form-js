import { Fragment } from 'preact/compat';
import { useContext, useState, useEffect } from 'preact/hooks';
import FillContext from '../slot-fill/FillContext';

import Fill from '../slot-fill/Fill';
import Slot from '../slot-fill/Slot';

import { useService } from '../../../render/hooks';

/**
 * A functional component that manages the state of injected renderers.
 * @param {Object} props - The props for the component.
 * @returns {any} The rendered component.
 */
export default (props) => {

  const eventBus = useService('eventBus');

  const helpers = {
    Fill,
    Slot
  };

  useEffect(() => {
    const handleRendered = () => {
      eventBus.fire('renderInjector.initialized');
    };

    eventBus.once('formEditor.rendered', 500, handleRendered);

    return () => eventBus.off('formEditor.rendered', handleRendered);
  }, [ eventBus ]);

  const [ injectedRenderers, setInjectedRenderers ] = useState([]);

  eventBus.on('renderInjector.registerRenderer', ({ identifier, Renderer }) => {
    setInjectedRenderers(e => e.filter(r => r.identifier !== identifier));
    setInjectedRenderers(e => [ ...e, { identifier, Renderer } ]);
  });

  eventBus.on('renderInjector.deregisterRenderer', ({ identifier }) => {
    setInjectedRenderers(e => e.filter(p => p.identifier !== identifier));
  });

  debugger;

  console.log('rerender injected renderers', injectedRenderers);

  return <Fragment>{ injectedRenderers.map(({ Renderer }) => <Renderer helpers={ helpers } />) }</Fragment>;

};