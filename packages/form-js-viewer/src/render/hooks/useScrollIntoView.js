import { some } from 'min-dash';
import { useEffect } from 'preact/hooks';
import { getScrollContainer } from '../components/util/domUtil';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

/**
 * Custom hook to scroll an element within a scrollable container.
 *
 * @param {Object} scrolledElementRef - A ref pointing to the DOM element to scroll into view.
 * @param {Array} deps - An array of dependencies that trigger the effect.
 * @param {Object} [scrollOptions={}] - Options defining the behavior of the scrolling.
 * @param {String} [scrollOptions.align='center'] - The alignment of the element within the viewport.
 * @param {String} [scrollOptions.behavior='auto'] - The scrolling behavior.
 * @param {Number} [scrollOptions.offset=0] - An offset that is added to the scroll position.
 * @param {Boolean} [scrollOptions.scrollIfVisible=false] - Whether to scroll even if the element is visible.
 * @param {Array} [flagRefs] - An array of refs that are used as flags to control when to scroll.
 */
export function useScrollIntoView(scrolledElementRef, deps, scrollOptions, flagRefs) {

  const _scrollOptions = scrollOptions || EMPTY_OBJECT;
  const _flagRefs = flagRefs || EMPTY_ARRAY;

  useEffect(() => {

    // return early if flags are not raised, or component is not mounted
    if (some(_flagRefs, ref => !ref.current) || !scrolledElementRef.current) {
      return;
    }

    for (let i = 0; i < _flagRefs.length; i++) {
      _flagRefs[i].current = false;
    }

    const itemToBeScrolled = scrolledElementRef.current;
    const scrollContainer = getScrollContainer(itemToBeScrolled);

    if (!scrollContainer) {
      return;
    }

    const itemRect = itemToBeScrolled.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    const { align = 'center', offset = 0, behavior = 'auto', scrollIfVisible = false } = _scrollOptions;

    const shouldScroll = scrollIfVisible || !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom);

    if (!shouldScroll) {
      return;
    }

    const topOffset = _getTopOffset(itemToBeScrolled, scrollContainer, { align, offset });
    scrollContainer.scroll({ top: topOffset, behavior });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}


// helper //////////////////////

function _getTopOffset(item, scrollContainer, options) {
  const itemRect = item.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  if (options.align === 'top') {
    return itemRect.top - containerRect.top + scrollContainer.scrollTop - options.offset;
  } else if (options.align === 'bottom') {
    return itemRect.bottom - containerRect.top - scrollContainer.clientHeight + scrollContainer.scrollTop + options.offset;
  } else if (options.align === 'center') {
    return itemRect.top - containerRect.top - scrollContainer.clientHeight / 2 + scrollContainer.scrollTop + itemRect.height / 2 + options.offset;
  }

  return 0;
}
