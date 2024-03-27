import Sandbox from '@jetbrains/websandbox';
import { useCallback, useEffect, useState } from 'preact/hooks';
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

  const paramsEval = useExpressionEvaluation(paramsDefinition);
  const params = useDeepCompareMemoize(isObject(paramsEval) ? paramsEval : {});

  const clearValue = useCallback(() => onChange({ field, value: undefined }), [ field, onChange ]);

  const safeSetValue = useCallback((value) => {

    if (value !== undefined) {

      // strip out functions and handle unserializeable objects
      try {
        value = JSON.parse(JSON.stringify(value));
        onChange({ field, value });
      } catch (e) {
        clearValue();
      }
    }

  }, [ field, onChange, clearValue ]);

  useEffect(() => {
    const hostAPI = {
      setValue: safeSetValue,
      error: (e) => {
        clearValue();
      }
    };

    // @ts-ignore
    const _sandbox = Sandbox.create(hostAPI, {
      frameContainer: `#${iframeContainerId}`,
      frameClassName: 'fjs-sandbox-iframe'
    });

    const wrappedUserCode = `
      const computeCallThisFunctionIfYouWantToCrashYourBrowser = (data) => {
        try {
          const setValue = Websandbox.connection.remote.setValue;
          ${functionDefinition}
        }
        catch (e) {
          Websandbox.connection.remote.error(e);
        }
      }

      Websandbox.connection.setLocalApi({ compute: computeCallThisFunctionIfYouWantToCrashYourBrowser });
    `;

    _sandbox.promise.then((sandboxInstance) => {
      sandboxInstance

        // @ts-ignore
        .run(wrappedUserCode)
        .catch(() => { onChange({ field, value: null }); })
        .then(() => { setSandbox(sandboxInstance); setHasRunLoad(false); });
    });

    return () => {
      _sandbox.destroy();
    };
  }, [ iframeContainerId, functionDefinition, onChange, field, paramsDefinition, computeOn, interval, safeSetValue, clearValue ]);

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
    <div id={ iframeContainerId } className="fjs-sandbox-iframe-container"></div>
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
    computeOn: 'load',
    interval: 1000,
    ...options,
  })
};