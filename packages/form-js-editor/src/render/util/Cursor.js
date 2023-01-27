import {
  classes as domClasses
} from 'min-dom';

const CURSOR_CLS_PATTERN = /^fjs-cursor-.*$/;


export function set(mode) {
  const classes = domClasses(document.body);

  classes.removeMatching(CURSOR_CLS_PATTERN);

  if (mode) {
    classes.add('fjs-cursor-' + mode);
  }
}

export function unset() {
  set(null);
}

export function has(mode) {
  const classes = domClasses(document.body);

  return classes.has('fjs-cursor-' + mode);
}
