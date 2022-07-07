import { debounce } from 'min-dash';

/**
 * A factory to create a configurable debouncer.
 *
 * @param {number|boolean} [config=true]
 */
export default function DebounceFactory(config = true) {

  const timeout = typeof config === 'number' ? config : config ? 300 : 0;

  if (timeout) {
    return fn => debounce(fn, timeout);
  } else {
    return fn => fn;
  }
}

DebounceFactory.$inject = [ 'config.debounce' ];