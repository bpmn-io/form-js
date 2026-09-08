import { createContext } from 'preact';

/**
 * Shares the navigation state of a multipage container with its pages.
 *
 * `focusOnMount` tells a page that mounts already active to take focus. A
 * condition can hide the page in view and reveal its replacement in the same
 * render, and that replacement has to be focused even though it was never
 * inactive.
 *
 * @type {import('preact').Context<{ activePageId: string|null, showAllPages: boolean, focusOnMount: boolean }>}
 */
export const MultiPageContext = createContext({
  activePageId: null,
  showAllPages: true,
  focusOnMount: false,
});
