import { useEffect } from 'preact/hooks';

export function useKeyDownAction(targetKey, action, listenerElement = window) {

  function downHandler({ key }) {
    if (key === targetKey) {
      action();
    }
  }

  useEffect(() => {
    listenerElement.addEventListener('keydown', downHandler);

    return () => {
      listenerElement.removeEventListener('keydown', downHandler);
    };
  });
}