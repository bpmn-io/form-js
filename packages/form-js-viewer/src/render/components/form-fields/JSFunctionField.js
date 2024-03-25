import Sandbox from '@jetbrains/websandbox';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { useExpressionEvaluation, useDeepCompareMemoize, usePrevious } from '../../hooks';
import { isObject } from 'min-dash';
import { v4 as uuidv4 } from 'uuid';

export function JSFunctionField(props) {
  const { field, onChange } = props;
  const {
    jsFunction: functionDefinition,
    functionParameters: paramsDefinition,
    computeOn,
    interval
  } = field;

  const [ sandbox, setSandbox ] = useState(null);
  const [ hasRunLoad, setHasRunLoad ] = useState(false);
  const [ iframeContainerId ] = useState(`fjs-sandbox-iframe-container_${uuidv4()}`);
  const iframeContainerRef = useRef(null);

  const paramsEval = useExpressionEvaluation(paramsDefinition);
  const params = useDeepCompareMemoize(isObject(paramsEval) ? paramsEval : {});

  const clearValue = useCallback(() => onChange({ field, value: undefined }), [ field, onChange ]);

  const sandboxError = useCallback((errorType, ...details) => {

    const baseError = `Sandbox error (${field.key}) - ${errorType}`;

    if (details.length) {
      console.error(baseError, '-', ...details);
    } else {
      console.error(baseError);
    }

  }, [ field.key ]);

  const safeSetValue = useCallback((value) => {

    if (value !== undefined) {

      // strip out functions and handle unserializeable objects
      try {
        value = JSON.parse(JSON.stringify(value));
        onChange({ field, value });
      } catch (e) {
        sandboxError('Unparsable return value');
        clearValue();
      }
    }

  }, [ onChange, field, sandboxError, clearValue ]);

  useEffect(() => {

    // (1) check for syntax validity of user code
    try {
      new Function(functionDefinition);
    } catch (e) {

      if (e instanceof SyntaxError) {
        sandboxError('Invalid syntax', e.message);
      }

      return;
    }

    // (2) create a new sandbox instance
    const hostAPI = {
      setValue: safeSetValue,
      runtimeError: (e) => {
        sandboxError('Runtime error', e.message);
        clearValue();
      }
    };

    const wrappedUserCode = `
    const ___executeUserCode___ = (data) => {
      try {
        const setValue = Websandbox.connection.remote.setValue;
        ${functionDefinition}
      }
      catch (e) {
        Websandbox.connection.remote.runtimeError(e);
      }
    }

    Websandbox.connection.setLocalApi({ compute: ___executeUserCode___ });
  `;

    const _sandbox = Sandbox.create(hostAPI, {
      frameContainer: `#${iframeContainerId}`,
      frameClassName: 'fjs-sandbox-iframe'
    });

    const iframe = iframeContainerRef.current.querySelector('iframe');
    iframe.removeAttribute('allow');

    // (3) run user code in sandbox
    _sandbox.promise.then((sandboxInstance) => {
      sandboxInstance

        // @ts-ignore
        .run(wrappedUserCode)
        .then(() => { setSandbox(sandboxInstance); setHasRunLoad(false); });
    });

    return () => {
      _sandbox.destroy();
    };
  }, [ iframeContainerId, functionDefinition, onChange, field, paramsDefinition, computeOn, interval, safeSetValue, clearValue, sandboxError ]);

  const prevParams = usePrevious(params);
  const prevSandbox = usePrevious(sandbox);

  useEffect(() => {

    if (!sandbox || !sandbox.connection.remote.compute) {
      return;
    }

    const runCompute = () => {
      sandbox.connection.remote.compute(params)
        .catch(clearValue)
        .then(safeSetValue);
    };

    if (computeOn === 'load' && !hasRunLoad) {
      runCompute();
      setHasRunLoad(true);
    }
    else if (computeOn === 'change' && (params !== prevParams || sandbox !== prevSandbox)) {
      runCompute();
    }
    else if (computeOn === 'interval') {
      const intervalId = setInterval(runCompute, interval);
      return () => clearInterval(intervalId);
    }

  }, [ params, prevParams, sandbox, prevSandbox, onChange, field, computeOn, hasRunLoad, interval, clearValue, safeSetValue ]);

  return (
    <div ref={ iframeContainerRef } id={ iframeContainerId } className="fjs-sandbox-iframe-container"></div>
  );
}

JSFunctionField.config = {
  type: 'script',
  label: 'JS Function',
  group: 'advanced',
  keyed: true,
  allowDoNotSubmit: true,
  escapeGridRender: true,
  create: (options = {}) => ({
    jsFunction: 'setValue(data.value)',
    functionParameters: '={\n  value: 42\n}',
    computeOn: 'change',
    interval: 1000,
    ...options,
  })
};