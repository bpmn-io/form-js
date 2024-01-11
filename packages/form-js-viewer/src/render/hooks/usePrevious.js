import {
  useState
} from 'preact/hooks';

export function usePrevious(value, defaultValue = null) {
  const [ current, setCurrent ] = useState(value);
  const [ previous, setPrevious ] = useState(defaultValue);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}