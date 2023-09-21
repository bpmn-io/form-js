import {
  useEffect,
  useRef
} from 'preact/hooks';


export default function usePrevious(value) {
  const ref = useRef();

  useEffect(() => ref.current = value);

  return ref.current;
}