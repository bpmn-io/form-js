import classNames from 'classnames';

export function editorFormFieldClasses(type, { disabled = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-disabled': disabled
  });
}

/**
 * Add a dragger that calls back the passed function with
 * { event, delta } on drag.
 *
 * @example
 *
 * function dragMove(event, delta) {
 *   // we are dragging (!!)
 * }
 *
 * domElement.addEventListener('dragstart', dragger(dragMove));
 *
 * @param {Function} fn
 * @param {Element} dragPreview
 *
 * @return {Function} drag start callback function
 */
export function createDragger(fn, dragPreview) {

  let self;

  let startX, startY;

  /** drag start */
  function onDragStart(event) {

    self = this;

    startX = event.clientX;
    startY = event.clientY;

    // (1) prevent preview image
    if (event.dataTransfer) {
      event.dataTransfer.setDragImage(dragPreview, 0, 0);
    }

    // (2) setup drag listeners

    // attach drag + cleanup event
    document.addEventListener('dragover', onDrag);
    document.addEventListener('dragend', onEnd);
    document.addEventListener('drop', preventDefault);
  }

  function onDrag(event) {
    const delta = {
      x: event.clientX - startX,
      y: event.clientY - startY
    };

    // call provided fn with event, delta
    return fn.call(self, event, delta);
  }

  function onEnd() {
    document.removeEventListener('dragover', onDrag);
    document.removeEventListener('dragend', onEnd);
    document.removeEventListener('drop', preventDefault);
  }

  return onDragStart;
}

/**
 * Throttle function call according UI update cycle.
 *
 * @param  {Function} fn
 *
 * @return {Function} throttled fn
 */
export function throttle(fn) {
  let active = false;

  let lastArgs = [];
  let lastThis = undefined;

  return function(...args) {

    lastArgs = args;
    lastThis = this;

    if (active) {
      return;
    }

    active = true;

    fn.apply(lastThis, lastArgs);

    window.requestAnimationFrame(function() {
      lastArgs = lastThis = active = undefined;
    });
  };

}

function preventDefault(event) {
  event.preventDefault();
  event.stopPropagation();
}