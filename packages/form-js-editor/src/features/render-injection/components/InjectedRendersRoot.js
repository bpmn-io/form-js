import { Fragment } from "preact";
import { useState } from "preact/hooks";

/**
 * A functional component that manages the state of injected renderers.
 * @param {Object} props - The props for the component.
 * @returns {any} The rendered component.
 */
export default (props) => {

    const { eventBus } = props;

    const [ injectedRenderers, setInjectedRenderers ] = useState([]);

    eventBus.on('renderInjector.registerRenderer', ({ identifier, Renderer }) => {
        setInjectedRenderers(e => e.filter(r => r.identifier !== identifier));
        setInjectedRenderers(e => [...e, { identifier, Renderer }]);
    });
    
    eventBus.on('renderInjector.deregisterRenderer', ({ identifier }) => {
        setInjectedRenderers(e => e.filter(p => p.identifier !== identifier));
    });

    return <Fragment>{ injectedRenderers.map(({ Renderer }) => { <Renderer { ...props } /> }) }</Fragment>

}