/**
 * Wrap CSS styles with a given prefix.
 *
 * @param {HTMLElement} rootNode
 * @param {string} prefix
 *
 * @returns {HTMLElement}
 */
function wrapCSSStyles(rootNode, prefix) {
  const styleTags = rootNode.querySelectorAll('style');
  styleTags.forEach(styleTag => {
    const topLevelRules = extractTopLevelRules(styleTag.textContent);
    const scopedCss = topLevelRules
      .map(rule => {
        const { selector, styles } = splitRule(rule);
        const scopedSelector = scopeSelector(selector, prefix);
        return `${scopedSelector} ${styles}`;
      })
      .join(' ');
    styleTag.textContent = scopedCss;
  });

  return rootNode;
}

function extractTopLevelRules(cssString) {
  let cursor = 0;
  let start = 0;
  let level = 0;
  const topLevelRules = [];

  while (cursor < cssString.length) {
    if (cssString[cursor] === '{') {
      level++;
    }

    if (cssString[cursor] === '}') {
      level--;
      if (level === 0) {
        topLevelRules.push(cssString.substring(start, cursor + 1));
        start = cursor + 1;
      }
    }

    cursor++;
  }

  return topLevelRules.map(rule => rule.trim());
}

function splitRule(rule) {
  const firstBracket = rule.indexOf('{');
  const selector = rule.substring(0, firstBracket);
  const styles = rule.substring(firstBracket);
  return { selector, styles };
}

function scopeSelector(selector, prefix) {
  return selector
    .split(',')
    .map(sel => `${prefix} ${sel.trim()}`)
    .join(', ');
}

function getScrollContainer(el) {
  while (el && el !== document.body && el !== document.documentElement) {
    if (_isElementScrollable(el)) {
      return el;
    }
    el = el.parentElement;
  }

  if (_isElementScrollable(document.body)) {
    return document.body;
  } else if (_isElementScrollable(document.documentElement)) {
    return document.documentElement;
  }

  return null;
}

function _isElementScrollable(el) {
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY || style.overflow;

  return (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
}

export { wrapCSSStyles, getScrollContainer };