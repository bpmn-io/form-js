const { useEffect, useRef, useCallback } = require('preact/hooks');

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  }, [ value ]);
  return ref.current;
};

export function useEffectDebugger(effect, dependencies, dependencyNames = [], effectName = 'noname') {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] (' + effectName + ') ', changedDeps);
  }

  useEffect(effect, [ effect, ...dependencies ]);
}

export function useCallbackDebugger(callback, dependencies, dependencyNames = [], callbackName = 'noname') {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log('[use-callback-debugger] (' + callbackName + ') ', changedDeps);
  }

  return useCallback(callback, [ callback, ...dependencies ]);
}