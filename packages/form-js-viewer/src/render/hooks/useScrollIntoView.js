import { some } from 'min-dash';
import { useEffect } from 'preact/hooks';

/**
 * Custom hook to scroll an element into view only when it is not visible within the viewport.
 *
 * @param {Object} targetRef - A ref pointing to the DOM element to scroll into view.
 * @param {Array} deps - An array of dependencies that trigger the effect.
 * @param {Array} flagRefs - An array of refs that are used as flags to control when to scroll.
 * @param {Object} [scrollOptions={}] - Options defining the behavior of the scrolling.
 * @param {String} [scrollOptions.align='center'] - The alignment of the element within the viewport.
 * @param {String} [scrollOptions.behavior='auto'] - The scrolling behavior.
 * @param {Number} [scrollOptions.offset=0] - An offset that is added to the scroll position.
 * @param {Boolean} [scrollOptions.scrollIfVisible=false] - Whether to scroll even if the element is visible.
 */
export default function useScrollIntoView(targetRef, deps, scrollOptions = null, flagRefs = []) {
  useEffect(() => {

    // return early if flags are not raised, or component is not mounted
    if (some(flagRefs, ref => !ref.current) || !targetRef.current) {
      return;
    }

    for (let i = 0; i < flagRefs.length; i++) {
      flagRefs[i].current = false;
    }

    const itemToBeScrolled = targetRef.current;
    const scrollContainer = _getNearestScrollableAncestor(itemToBeScrolled);

    if (!scrollContainer) {
      return;
    }

    const itemRect = itemToBeScrolled.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    // should scroll if visible or scrollIfVisible option is set
    const shouldScroll = scrollOptions.scrollIfVisible || !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom);

    if (!shouldScroll) {
      return;
    }

    const {
      align = 'center',
      offset = 0,
      behavior = 'auto'
    } = scrollOptions;

    const topOffset = _getTopOffset(itemToBeScrolled, scrollContainer, { align, offset });
    scrollContainer.scroll({
      top: topOffset,
      behavior,
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}


// helper //////////////////////

function _getNearestScrollableAncestor(el) {
  while (el) {
    if (el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
}

function _getTopOffset(item, scrollContainer, options) {

  const itemRect = item.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  if (options.align === 'top') {
    return itemRect.top - containerRect.top + scrollContainer.scrollTop - options.offset;
  }
  else if (options.align === 'bottom') {
    return itemRect.bottom - containerRect.top - scrollContainer.clientHeight + scrollContainer.scrollTop + options.offset;
  }
  else if (options.align === 'center') {
    return itemRect.top - containerRect.top - scrollContainer.clientHeight / 2 + scrollContainer.scrollTop + itemRect.height / 2 + options.offset;
  }

  return 0;
}