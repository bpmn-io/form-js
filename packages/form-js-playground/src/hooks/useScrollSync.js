import { useState, useCallback, useEffect } from 'preact/hooks';

/**
 * Keep N scrollviewers in sync of eachother based on their child elements
 *
 * @param {{correlationFunction: function, members: {scrollableElement: Element, childrenQuery: String}[]}} syncInfo Information detailing the scroll areas to keep in sync, and the query to get the items to sync
 */
export default function(syncInfo) {

  const [ primaryScrollAreaInfo, setPrimaryScrollAreaInfo ] = useState(null);

  const onMouseEnter = useCallback((e) => {
    const primaryInfo = syncInfo.members.find(member => member.scrollableElement === e.target);
    return setPrimaryScrollAreaInfo(primaryInfo);
  }, [ syncInfo.members ]);

  // scrollarea hover detection
  useEffect(() => {

    if (syncInfo.members.length < 2) return;

    for (const { scrollableElement } of syncInfo.members) {
      scrollableElement?.addEventListener('mouseenter', onMouseEnter);
    }

    return () => {
      for (const { scrollableElement } of syncInfo.members) {
        scrollableElement?.removeEventListener('mouseenter', onMouseEnter);
      }
    };

  }, [ syncInfo, onMouseEnter ]);

  const sync = useCallback((e) => {

    const {
      members
    } = syncInfo;

    const {
      scrollableElement: primaryScrollableElement,
      childrenQuery: primaryChildrenQuery
    } = primaryScrollAreaInfo;

    const _getScrollMidPoint = (node) => node.scrollTop + node.offsetHeight / 2;

    const primaryScrollMidPoint = _getScrollMidPoint(primaryScrollableElement);
    const primaryChildren = primaryScrollableElement.querySelectorAll(primaryChildrenQuery);

    const _getPrimaryIndex = () => {

      let currentIndex = 0;

      for (const child of primaryChildren) {

        const childTopMargin = (child.currentStyle || window.getComputedStyle(child)).marginTop;
        const marginAdjustedOffsetTop = child.offsetTop - parseInt(childTopMargin);

        // if the new scroll target is between
        if (child.offsetTop <= primaryScrollMidPoint && (primaryScrollMidPoint - child.offsetTop <= child.offsetHeight)) {
          return [ currentIndex, (primaryScrollMidPoint - child.offsetTop) / child.offsetHeight ];
        }

        if ((child.offsetTop + child.offsetHeight) >= primaryScrollMidPoint) {
          return [ currentIndex, 0 ];
        }

        currentIndex++;
      }

      return 0;

    };

    const [ primaryScrollIndex, primaryScrollPartial ] = _getPrimaryIndex();

    for (const { scrollableElement, childrenQuery } of members) {
      if (scrollableElement === primaryScrollableElement) continue;

      const children = scrollableElement.querySelectorAll(childrenQuery);
      const scrollTarget = children[primaryScrollIndex];

      const targetHeight = scrollTarget.offsetTop + scrollTarget.offsetHeight * primaryScrollPartial;
      const newScrollTop = targetHeight - scrollableElement.offsetHeight / 2;

      // scrollableElement.scrollTop = primaryScrollableElement.scrollTop;

      // TODO: Smooth out corners
      scrollableElement.scrollTop = newScrollTop;
    }

  }, [ primaryScrollAreaInfo, syncInfo ]);

  // hovered area scroll detection
  useEffect(() => {

    primaryScrollAreaInfo?.scrollableElement?.addEventListener('scroll', sync);

    return () => primaryScrollAreaInfo?.scrollableElement?.removeEventListener('scroll', sync);

  }, [ primaryScrollAreaInfo, sync ]);

  return primaryScrollAreaInfo;
}


const _getSyncedScrollTop = (leaderMidpointHeight, leaderChildren, targetScrollArea, targetQuery) => {

};