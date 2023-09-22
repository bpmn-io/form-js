import {
  useEffect,
  useRef
} from 'preact/hooks';


export default function usePrevious(value, defaultValue, dependencies) {
  const ref = useRef(defaultValue);

  useEffect(() => ref.current = value, dependencies);

  return ref.current;
}