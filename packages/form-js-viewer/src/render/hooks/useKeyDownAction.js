import { useEffect } from 'preact/hooks';

export default function useKeyDownAction(targetKey, action, keyEventsListener = window) {

  function downHandler({ key }) {
    if (key === targetKey) {
      action();
    }
  }

  useEffect(() => {
    keyEventsListener.addEventListener('keydown', downHandler);

    return () => {
      keyEventsListener.removeEventListener('keydown', downHandler);
    };
  });
}