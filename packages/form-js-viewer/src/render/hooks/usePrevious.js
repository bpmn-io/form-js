import {
  useEffect,
  useRef
} from 'preact/hooks';


export default function usePrevious(value, defaultValue = null) {
  const ref = useRef(defaultValue);

  useEffect(() => ref.current = value, [ value ]);

  return ref.current;
}